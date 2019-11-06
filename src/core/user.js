import { User } from '../classes/User';
import React from 'react';
import store from '../store';
import { clearPortfolioAssets, clearUnapprovedAssets, setCurrentUser, setLocalPortfolioWallets, setPortfolioLoaded, setUserTotal, setCoinbase, setCurrentPortfolio, resetUserState, removePortfolioAsset, updatePortfolioAsset, toggleUserCreationPending, setUserLoggedOut, clearEtherBalances } from '../actions';
import { notification } from 'antd';
import { doStringsMatchIgnoringCase, trimAddress, emptyAddress, convertFromSolidityAndFormatForDisplay } from '../util/helpers';
import { getOrLoadPlatformContract } from '../util/web3/contracts';
import { PortfolioAsset } from '../classes/PortfolioAsset';
import { CustomerData } from '../classes/CustomerData';
import UserTokenBalance from '../classes/UserTokenBalance';
import * as _ from 'lodash';
import { loadUnApprovedAssets } from './loadAssets';
import { createUserPortfolioEvents, createUserAdminApprovalEvents } from './userEvents';
import { unsubscribeUserEvents, USER_EVENT_ASSETTOKEN_RECEIVED, USER_EVENT_ASSETTOKEN_SENT, BlockchainEvent, USER_EVENT_BITCAR_SENT, startMultipleUserEvents, USER_EVENT_BITCAR_RECEIVED } from "../util/web3/eventHelper";
import { getUserRank } from './rankTracking';
import { setBitCarBalance, setEtherBalance } from "../actions";
import { callEthereumMethod } from '../util/web3/web3Wrapper';
import { getLocalWalletData } from './walletManagement';
import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS_USER_BITCAR, DISPLAY_DECIMALS_ETH } from '../util/globalVariables';

export async function createUser(coinbase, web3, preventDashboardload) {
    
    if (!coinbase || !web3) {
        console.warn("Wallet address is invalid - user data unavailable.");
        return loadDefaultUser();
    }

    // check if user creation process is already running
    if (store.getState().UIstate.userCreationPending) return;

    const checksumAddress = web3.utils.toChecksumAddress(coinbase);

    // console.log(`Validating user account for wallet address ${checksumAddress}`);
    store.dispatch(toggleUserCreationPending(true));

    let hasErrored = false;

    const userData = await Promise.all([
        checkRole('Trader', checksumAddress, web3),
        checkRole('Agent', checksumAddress, web3),
        checkRole('Admin', checksumAddress, web3),
        checkRole('Sudo', checksumAddress, web3),
        getUserRank(web3, checksumAddress),
        getCustomerData(web3, checksumAddress)
    ]).catch(error => {
        hasErrored = true;
        console.error(`Error loading user '${coinbase}' data from blockchain`, error);
    });

    if(hasErrored) {
        notification.error({
            message: 'Login Failed',
            description: <React.Fragment>Failed to read user data from blockchain, for help <a href="#/FAQ/LoginError">click here</a>.<br />Wallet address: {trimAddress(checksumAddress)}</React.Fragment>,
            className: 'notification-error',
            duration: 30,
            placement: 'bottomRight'
        });
        return loadDefaultUser();
    }
    
    const isTrader = userData[0];
    const isAgent = userData[1];
    const isAdmin = userData[2];
    const isSudo = userData[3];
    const rank = userData[4];
    const customerData = userData[5];
    const user = new User(checksumAddress, isTrader, isAgent, isAdmin, isSudo, rank, customerData);

    subscribeUserToBitCarBalanceChange(user, web3);

    loadPortfolioWallets(user);

    // console.log("created user", user);

    // send toaster message
    notification.success({
        message: 'User logged in',
        description: 'Wallet address: ' + trimAddress(checksumAddress),
        className: 'notification-success',
        duration: 6,
        placement: 'bottomRight'
    });
    store.dispatch(setCoinbase(checksumAddress));
    store.dispatch(setCurrentUser(user));
    store.dispatch(toggleUserCreationPending(false));

    if(!preventDashboardload) {
        const assetState = store.getState().AssetState
        loadUserDashboard(assetState.allAssets, web3, user, assetState.loadedAssets);
    }
    
    // console.log(user);
    return user;
};

export async function signoutUser() {
    store.dispatch(setUserLoggedOut(true));
    clearUserState();
    store.dispatch(setCoinbase(null));
    loadDefaultUser();
  
    // send toaster message
    notification.info({
      message: 'User logged out',
      description: '',
      className: 'notification-info',
      duration: 6,
      placement: 'bottomRight'
    });
}

export function clearUserState() {
    unsubscribeUserEvents();
    store.dispatch(resetUserState());
    store.dispatch(clearUnapprovedAssets());
}

export function loadDefaultUser() {
    store.dispatch(toggleUserCreationPending(true));

    const user = new User(null, false, false, false, false, null);
    store.dispatch(setCurrentUser(user));
    loadPortfolioWallets(null);

    store.dispatch(toggleUserCreationPending(false));
    
    return user;
}

async function loadPortfolioWallets (user) {
    const walletData = getLocalWalletData(user);
    store.dispatch(setLocalPortfolioWallets(walletData));
}

export async function loadUserDashboard(allAssets, web3, user, loadedAssets) {

    if(user.canAccessUnapprovedAssets) {
        const unapprovedAssets = await loadUnApprovedAssets(allAssets, web3, user);

        if(user.isAdmin) {
            unapprovedAssets.filter(asset => asset.adminApprovalProgress !== undefined).map(unapprovedAsset => createUserAdminApprovalEvents(unapprovedAsset, user, web3));
        }
    }
}

async function checkRole(contractName, coinbase, web3) {

    if(!coinbase) {
        return false;
    }
    
    // check deployed contract already exist in state, if not create them and put them in state
    const loadedContract = await getOrLoadPlatformContract(contractName, web3);
    return await checkUserAccount(loadedContract, coinbase);
}

async function checkUserAccount (contract, coinbase) {
    if (!contract) return false;
    return await callEthereumMethod(contract.methods.isRole(coinbase));
}

export async function updatePortfolioAssetBalance(asset, hotWallet, coldWallet, platformTokenContract) {
    
    let portfolioAsset = undefined;

    const portfolioBalances = await Promise.all([
        getAddressTokenBalance(asset, hotWallet),
        getAddressTokenBalance(asset, coldWallet)
    ]).catch(error => {
        console.error('Error retrieving user balances for wallet addresses', error);
        return portfolioAsset;
    });

    const hotBalance = portfolioBalances[0];
    const coldBalance = portfolioBalances[1];

    if(hotBalance.isGreaterThan(0) || coldBalance.isGreaterThan(0)) {

        let assetBalances = await Promise.all([callEthereumMethod(platformTokenContract.methods.balanceOf(asset.beeContract.address)),
            callEthereumMethod(asset.assetTokenContract.methods.balanceOf(asset.address))]).catch(error => {
                console.error('Error retrieving asset balances for portfolio', error);
                return portfolioAsset;
            });
        
        if(!assetBalances) {
            console.error("Unable to retrieve assetBalances");
            return;
        }
    
        const assetEscrowBalance = new BigNumber(assetBalances[0]);
        const platformBalance = new BigNumber(assetBalances[1]);
    
        const qtySold = asset.totalTokenSupply.minus(platformBalance);

        const userTokenBalance = new UserTokenBalance(hotBalance, coldBalance);

        portfolioAsset = new PortfolioAsset(asset, userTokenBalance, assetEscrowBalance, qtySold);
        store.dispatch(updatePortfolioAsset(portfolioAsset));

        // console.log('Update balance event for', asset.tokenCode);
        // console.log('userTokenBalance', userTokenBalance.toFormat(0));
        // console.log('assetEscrowBalance', assetEscrowBalance.toFormat(0));
        // console.log('platformBalance', platformBalance.toFormat(0));
        // console.log('qtySold', qtySold.toFormat(0));
        // console.log('User escrow', assetEscrowBalance.dividedBy(qtySold).multipliedBy(userTokenBalance).toFormat(0));
    } else {
        store.dispatch(removePortfolioAsset(asset.address));
    }

    return portfolioAsset;
}

async function getAddressTokenBalance(asset, address) {
    
    if(!address) {
        return new BigNumber(0);
    }

    return new BigNumber(await callEthereumMethod(asset.assetTokenContract.methods.balanceOf(address)));
}

export async function loadPortfolioForWallet(loadedAssets, user) {

    const dummyUser = new User(null, false, false, false, false, null);
    dummyUser.hotWallet = user;

    return await loadPortfolioForUser(loadedAssets, dummyUser);
}

export async function loadPortfolioForUser(loadedAssets, user) {

    const hotWallet = user ? user.hotWallet : undefined;
    const coldWallet = user ? user.coldWallet : undefined;

    const portfolioAddress = hotWallet && coldWallet ? hotWallet + coldWallet : hotWallet;

    try {

        const uiState = store.getState().UIstate;

        const web3 = uiState.web3;

        if(!user || !hotWallet || !web3.utils.isAddress(hotWallet)) {
            store.dispatch(clearPortfolioAssets());
            // console.log("Cannot load user portfolio as the provided user or hot wallet address is not valid.", user);
            return;
        }

        if(!loadedAssets) {
            // console.log('no assets');
            store.dispatch(clearPortfolioAssets());
        }

        if(doStringsMatchIgnoringCase(portfolioAddress, uiState.currentPortfolio)) {
            // console.log("Matched - not reloading portfolio data");
            return;
        }

        store.dispatch(clearPortfolioAssets());

        unsubscribeUserEvents((event, key, collection) => {
            return key.startsWith(USER_EVENT_ASSETTOKEN_RECEIVED) || key.startsWith(USER_EVENT_ASSETTOKEN_SENT);
        });

        let assetPromises = [];

        const platformTokenContract = uiState.platformTokenContract;

        _.map(loadedAssets, asset => {
            assetPromises.push(new Promise(async (resolve, reject) => {
                    resolve(await updatePortfolioAssetBalance(asset, hotWallet, coldWallet, platformTokenContract));
                })
            );

            createUserPortfolioEvents(asset, hotWallet, coldWallet, web3, platformTokenContract).catch(error => {
                console.error(`Failed to create portfolio blockchain events for wallet addresses trading: '${hotWallet}' and storage: '${coldWallet}`, error);
            })
        });
    
        let results = await Promise.all(assetPromises);
        
        let portfolioAssets = [];
        let assetTotal = new BigNumber();

        results.map(asset => {
            if(asset !== undefined) {
                assetTotal.plus(asset.totalUserBalance);
                portfolioAssets.push(asset);
            }
        });

        // console.log('User Portfolio loaded', portfolioAssets);

        store.dispatch(setUserTotal(convertFromSolidityAndFormatForDisplay(assetTotal, 0)));

    } catch(error) {
        console.error(`Failed to load portfolio for current user.`, error);
    } finally {
        store.dispatch(setPortfolioLoaded(true));
        store.dispatch(setCurrentPortfolio(portfolioAddress));
    }
}

const subscribeUserToBitCarBalanceChange = (user, web3) => {
    if(!user || !user.coinbase || !web3) {
        return;
    }

    const hotWallet = user.hotWallet ? user.hotWallet : user.coinbase;
    const coldWallet = user.coldWallet;

    let bitcarEventFilter = [hotWallet];

    if(coldWallet) {
        bitcarEventFilter.push(coldWallet);
    }

    getOrLoadPlatformContract("PlatformToken", web3).then(contract => {
    
        let fromBitCarEvent = new BlockchainEvent(USER_EVENT_BITCAR_SENT, {filter: {from: bitcarEventFilter}, fromBlock:"latest"}
            , (error, event) => {
                // console.log("UserBalance from event", event);
                setUserBitCarBalance(contract, hotWallet);
            }
        );

        let toBitCarEvent = new BlockchainEvent(USER_EVENT_BITCAR_RECEIVED, {filter: { to: bitcarEventFilter}, fromBlock:"latest"}
            , (error, event) => {
                // console.log("UserBalance to event", event);
                setUserBitCarBalance(contract, hotWallet);
            }
        );

        startMultipleUserEvents([toBitCarEvent, fromBitCarEvent], contract.events.Transfer);

        setUserBitCarBalance(contract, hotWallet);
        setUserBitCarBalance(contract, coldWallet);
    });
};

export const setUserEthereumBalance = async (web3, currentUser) => {

    if(!currentUser || !currentUser.coinbase) {
        store.dispatch(clearEtherBalances());
        return;
    }

    const hotWallet = currentUser.hotWallet ? currentUser.hotWallet : currentUser.coinbase;
    const coldWallet = currentUser.coldWallet;

    let balancesToRetrieve = [web3.eth.getBalance(hotWallet)];

    if(coldWallet) {
        balancesToRetrieve.push(web3.eth.getBalance(coldWallet));
    }

    let hasErrored = false;


    // console.log('Getting balances for eth');
    let balances = await Promise.all(balancesToRetrieve).catch(error => {
        hasErrored = true;
        // console.error("Error getting eth balances", error);
        store.dispatch(clearEtherBalances());
    });

    if(hasErrored) {
        return;
    }

    dispatchEthBalance(web3, hotWallet, balances[0]);

    if(coldWallet) {
        dispatchEthBalance(web3, coldWallet, balances[1]);
    }
}

const dispatchEthBalance = (web3, address, balance) => {

    const etherValue = new BigNumber(web3.utils.fromWei(new BigNumber(balance).toFixed(0)));

    const formatDecimals = etherValue.isGreaterThanOrEqualTo(10000) ? 2 : DISPLAY_DECIMALS_ETH;

    const formattedValue = etherValue.toFormat(formatDecimals);

    // console.log("Balance being set to:", formattedBalance);
    store.dispatch(setEtherBalance({address: address, balance: formattedValue}));
}

const setUserBitCarBalance = async (contract, coinbase) => {

    if(!coinbase) {
        return;
    }

    // console.log("Called setUserBitCarBalance", coinbase);

    let balance = new BigNumber(await callEthereumMethod(contract.methods.balanceOf(coinbase)));
    const formattedBalance = formatBitCarResult(coinbase, balance);
    // console.log("Balance being set to:", formattedBalance);
    store.dispatch(setBitCarBalance(formattedBalance));
}

const formatBitCarResult = (address, balance) => {
    return {address: address, bitcarBalance:balance, bitcarDisplayBalance:convertFromSolidityAndFormatForDisplay(balance, DISPLAY_DECIMALS_USER_BITCAR)};
}

const getCustomerData = async (web3, coinbase) => {
    const kycProcessTrackerContract = await loadPlatformKycProcessTracker(web3);

    const customerWallets = await callEthereumMethod(kycProcessTrackerContract.methods.getWallets(coinbase)).catch(error => {
        console.error("Error retrieving wallet data for user", error);
    });

    let customerData = undefined;
    let hotWallet = customerWallets ? getValidWalletAddress(customerWallets._hotWallet, web3) : undefined;
    let coldWallet = customerWallets ? getValidWalletAddress(customerWallets._coldWallet, web3) : undefined;

    if(hotWallet) {
        customerData = await callEthereumMethod(kycProcessTrackerContract.methods.getCustomer(hotWallet));
    }

    return customerData ? new CustomerData(hotWallet, customerData._status, customerData._region, customerData._membership, coldWallet, customerData._count) : new CustomerData(hotWallet, undefined, undefined, undefined, coldWallet, undefined);
}

const getValidWalletAddress = (address, web3) => {
    return doStringsMatchIgnoringCase(address, emptyAddress) ? undefined : web3.utils.toChecksumAddress(address);
}

export const loadPlatformKycProcessTracker = async (web3) => {

    let kycProcessTrackerContract = undefined;

    try {
        kycProcessTrackerContract = await getOrLoadPlatformContract('KycProcessTracker', web3);

    } catch (error) {
        kycProcessTrackerContract = null;
        console.error("Error whilst loading platform Customer Data contract.", error);
    }

    // console.log('resolving rankTrackerContract');
    return kycProcessTrackerContract;
}

export const haveUserWalletsChanged = (previousUser, currentUser) => {
    if((previousUser === undefined && currentUser !== undefined)
        || (previousUser === null && currentUser !== null)) {
        return true;
    }

    if((previousUser.hotWallet !== currentUser.hotWallet) || previousUser.coldWallet !== currentUser.coldWallet) {
        return true;
    }

    return false;
}