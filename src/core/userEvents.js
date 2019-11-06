import { BlockchainEvent, startMultipleUserEvents, startUserEvent,
    USER_EVENT_ASSETTOKEN_SENT, USER_EVENT_ASSETTOKEN_RECEIVED,
    USER_EVENT_ADMIN_CREATE_TOKENCONTRACT, USER_EVENT_ADMIN_CREATE_FEEMANAGER, USER_EVENT_ADMIN_CREATE_WHITELIST, USER_EVENT_ADMIN_SET_PURCHASE_PERCENT } from "../util/web3/eventHelper";
import { adminAssetApprovalProgress, getCurrentAdminApprovalProgress } from '../util/assetHelpers';
import { updateUnapprovedAsset } from '../actions';
import { loadAssetTokenContractAndDependants } from './loadAssets';
import { loadFeeManagerContractAndDependants } from './loadFeeManagerContract';
import { loadWhitelistContractAndDependants } from './loadWhitelistContract';
import { getOrLoadPlatformContract } from '../util/web3/contracts';
import { updatePortfolioAssetBalance } from './user';
import store from '../store';

export async function createUserPortfolioEvents(asset, hotWallet, coldWallet, web3, platformTokenContract) {

    if(!web3.utils.isAddress(hotWallet)) {
        console.error("Cannot create user portfolio events as the provided wallet address is not valid.", hotWallet);
        return;
    }

    let addressFilter = [hotWallet];

    if(web3.utils.isAddress(coldWallet)) {
        addressFilter.push(coldWallet);
    }

    let assetAddress = asset.address;

    let fromEvent = new BlockchainEvent(`${USER_EVENT_ASSETTOKEN_RECEIVED}${assetAddress}`
                        , {filter: { from: addressFilter }, fromBlock:"latest"}
                        , (error, event) => { 
                            // console.log(`Asset from event for token code '${asset.tokenCode}'`, event);
                            updatePortfolioAssetBalance(asset, hotWallet, coldWallet, platformTokenContract);
                            }
                        );

    let toEvent = new BlockchainEvent(`${USER_EVENT_ASSETTOKEN_SENT}${assetAddress}`
                        , {filter: { to: addressFilter }, fromBlock:"latest"}
                        , (error, event) => { 
                            // console.log(`Asset to event for token code '${asset.tokenCode}'`, event);
                            updatePortfolioAssetBalance(asset, hotWallet, coldWallet, platformTokenContract);
                            }
                        );
    // console.log(`Portfolio events created for coinbase ${coinbase}`, asset.address);
    startMultipleUserEvents([toEvent, fromEvent], asset.assetTokenContract.events.Transfer);
}

export async function createUserAdminApprovalEvents(unapprovedAsset, user, web3) {
    //console.log("createUserAdminApprovalEvents, user:", user);
    if(!user || !user.isAdmin) {
        return;
    }
    //console.log("createUserAdminApprovalEvents, asset:", unapprovedAsset);

    const currentProgress = getCurrentAdminApprovalProgress(unapprovedAsset);
    const address = unapprovedAsset.address;
    const filter = {filter: {createdBy: address}};

    if(currentProgress === adminAssetApprovalProgress.NOTHING_CREATED) {
        const tokenContractCreation = new BlockchainEvent(`${USER_EVENT_ADMIN_CREATE_TOKENCONTRACT}${address}`, filter
        , (error, event) => {
            const adminApprovalProgress = adminAssetApprovalProgress.ASSET_TOKEN_CREATED;
            let updatedAsset = cloneCurrentAssetAndSetProgress(address, adminApprovalProgress);
            let updatedData = new Promise(async resolve => resolve(await loadAssetTokenContractAndDependants(address, web3, adminApprovalProgress)));

            updatedAsset.setAssetTokenData(updatedData);
            updateAssetInStore(updatedAsset);
        });

        const assetTokenFactoryContract = await getOrLoadPlatformContract('AssetTokenFactory', web3);
        startUserEvent(tokenContractCreation, assetTokenFactoryContract.events.ContractCreated);
        // console.log("event registered for asset token creation", address);
    }

    if(currentProgress <= adminAssetApprovalProgress.ASSET_TOKEN_CREATED) {
        const percentSet = new BlockchainEvent(`${USER_EVENT_ADMIN_SET_PURCHASE_PERCENT}${address}`, filter
        , (error, event) => {
            const adminApprovalProgress = adminAssetApprovalProgress.PURCHASE_PERCENTAGE_SET;
            let updatedAsset = cloneCurrentAssetAndSetProgress(address, adminApprovalProgress);
            updatedAsset.setBitcarPercent(parseInt(event.returnValues[0]));
            updateAssetInStore(updatedAsset);
        });

        startUserEvent(percentSet, unapprovedAsset.assetContract.events.BitCarPercentChanged);
        // console.log("event registered for bitcar percent", address);
    }

    if(currentProgress <= adminAssetApprovalProgress.PURCHASE_PERCENTAGE_SET) {
        const feeManagerContractCreation = new BlockchainEvent(`${USER_EVENT_ADMIN_CREATE_FEEMANAGER}${address}`, filter
        , (error, event) => {
            const adminApprovalProgress = adminAssetApprovalProgress.FEE_MANAGER_CREATED;
            let updatedAsset = cloneCurrentAssetAndSetProgress(address, adminApprovalProgress);
            let updatedData = new Promise(async resolve => resolve(await loadFeeManagerContractAndDependants(unapprovedAsset.address, web3, adminApprovalProgress)));

            updatedAsset.setFeeManagerData(updatedData);
            updateAssetInStore(updatedAsset);
        });

        const feeManagerFactoryContract = await getOrLoadPlatformContract('FeeManagerFactory', web3);
        startUserEvent(feeManagerContractCreation, feeManagerFactoryContract.events.ContractCreated);
        // console.log("event registered for fee manager creation", address);
    }

    if(currentProgress <= adminAssetApprovalProgress.FEE_MANAGER_CREATED) {
        const whitelistContractCreation = new BlockchainEvent(`${USER_EVENT_ADMIN_CREATE_WHITELIST}${address}`, filter
        , (error, event) => {
            const adminApprovalProgress = adminAssetApprovalProgress.WHITELIST_CREATED;
            let updatedAsset = cloneCurrentAssetAndSetProgress(address, adminApprovalProgress);
            let updatedData = new Promise(async resolve => resolve(await loadWhitelistContractAndDependants(unapprovedAsset.address, web3, adminApprovalProgress)));

            updatedAsset.setWhitelistData(updatedData);
            updateAssetInStore(updatedAsset);
        });

        const whitelistFactoryContract = await getOrLoadPlatformContract('AssetWhitelistFactory', web3);
        startUserEvent(whitelistContractCreation, whitelistFactoryContract.events.ContractCreated);
        // console.log("event registered for whitelist creation", address);
    }
}

function cloneCurrentAssetAndSetProgress(assetAddress, adminApprovalProgress) {
    const currentAsset = store.getState().AssetState.unapprovedAssets[assetAddress];
    let newAsset = currentAsset.clone();
    newAsset.adminApprovalProgress = adminApprovalProgress;
    return newAsset;
}

function updateAssetInStore (updatedAsset) {
    store.dispatch(updateUnapprovedAsset(updatedAsset));
}