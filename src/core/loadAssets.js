import axios from 'axios';
import { doStringsMatchIgnoringCase, ipfsUrl } from '../util/helpers';
import { loadContractIntoWeb3, loadPlatformWeb3Contract, isValidContractAddress } from '../util/web3/contracts';
import store from '../store';
import LoadedAsset from '../classes/LoadedAsset';
import TokenContractData from '../classes/TokenContractData';
import { loadAssetRankTrackerContractAndDependants } from './rankTracking';
import { loadFeeManagerContractAndDependants, getDefaultFeeManagerData, getFeeManagerCreationProgress } from './loadFeeManagerContract';
import { loadWhitelistContractAndDependants, getDefaultWhitelistData } from './loadWhitelistContract';
import { setupEventsForAllAssets, setupEventsForAllLiveAssets } from './platformEvents';
import { setAllAssets, setAllLoadedAssets, setAllUnapprovedAssets, updateUnapprovedAsset } from '../actions';
import { adminAssetApprovalProgress, adminAssetFeeManagerProgress, assetApprovalState, getAdminApprovalProgress } from '../util/assetHelpers';
import * as _ from 'lodash';

//TODO: remove this import as just needed temporarily for loading fees
import { daysToSeconds, yearsToSeconds } from '../util/helpers';
import BaseAssetData from '../classes/BaseAssetData';
import { callEthereumMethod } from '../util/web3/web3Wrapper';
import { EXCLUDED_ASSET_CONTRACTS, ASSET_DESCRIPTION_OVERRIDE } from '../util/globalVariables';

const axiosInstance = axios.create({
    baseURL: ipfsUrl,
    timeout: 1200000
});

const toResultObject = (promise) => {
    return promise
    .then(result => ({ success: true, result }))
    .catch(error => ({ success: false, error }));
};

export async function loadAssets(assetContracts, web3) {
    //console.log('loading all', assetContracts)
    let assetLoadPromises = [];
    assetContracts.map(assetContract => assetLoadPromises.push(loadBaseAssetContractData(assetContract)));

    const allAssets = await Promise.all(assetLoadPromises);
    setupEventsForAllAssets(allAssets, web3);

    const allAssetsDictionary = {};
    allAssets.map(asset => allAssetsDictionary[asset.address] = asset);
    store.dispatch(setAllAssets(allAssetsDictionary));

    //console.log("All Assets", allAssetsDictionary);
    return allAssets;
}

export async function loadLiveAssets (allAssets, web3){

    let liveAssets = _.filter(allAssets, asset => asset.isLive);

    let assetLoadPromises = [];
    liveAssets.map(liveAsset => assetLoadPromises.push(loadAllContractData(liveAsset, web3)));

    const loadedAssets = await Promise.all(assetLoadPromises);

    const loadedAssetsArray = loadedAssets.filter(asset => asset !== undefined);
    const loadedAssetsDictionary = {};
    loadedAssetsArray.map(asset => loadedAssetsDictionary[asset.address] = asset);
    store.dispatch(setAllLoadedAssets(loadedAssetsDictionary));
    setupEventsForAllLiveAssets(loadedAssetsArray, web3);

    //console.log("Live Assets", loadedAssetsDictionary);

    return loadedAssetsArray;
}

export async function loadUnApprovedAssets(allAssets, web3, user) {

    let unApprovedAssets = _.filter(allAssets, asset => !asset.isLive && (user.isAdmin || user.isSudo || doStringsMatchIgnoringCase(user.coinbase, asset.agent)));

    //console.log("unApprovedAssets", unApprovedAssets);

    let assetLoadPromises = [];
    unApprovedAssets.map(unApprovedAsset => assetLoadPromises.push(loadAllContractData(unApprovedAsset, web3)));

    const loadedAssets = await Promise.all(assetLoadPromises);

    const unapprovedAssetsArray = loadedAssets.filter(asset => asset !== undefined);
    const unapprovedAssetsDictionary = {};
    unapprovedAssetsArray.map(asset => unapprovedAssetsDictionary[asset.address] = asset);
    store.dispatch(setAllUnapprovedAssets(unapprovedAssetsDictionary));

    // console.log("unapprovedAssetsDictionary", unapprovedAssetsDictionary);

    return unapprovedAssetsArray;
}

export async function reloadUnApprovedAsset(unapprovedAssetAddress, web3) {
    const stateBaseAsset = store.getState().AssetState.allAssets[unapprovedAssetAddress];
    const reloadedAsset = loadAllContractData(stateBaseAsset, web3);
    updateUnapprovedAsset(reloadedAsset);
}

export async function loadBaseAssetContractData(assetContract) {
    const baseAssetData = await Promise.all([
        callEthereumMethod(assetContract.methods.agent()),
        callEthereumMethod(assetContract.methods.state()),
        callEthereumMethod(assetContract.methods.dataHash()),
        callEthereumMethod(assetContract.methods.adminRejections()),
        callEthereumMethod(assetContract.methods.agentRejections()),
        callEthereumMethod(assetContract.methods.minPurchaseAmount())
    ]);

    let baseAsset = new BaseAssetData(assetContract, baseAssetData[0], parseInt(baseAssetData[1]),
    baseAssetData[2], baseAssetData[3], baseAssetData[4], baseAssetData[5]);

    return baseAsset;
}

export async function loadAllContractData(baseAsset, web3) {

    const assetContract = baseAsset.assetContract;
    const approvalState = baseAsset.approvalState;
    let adminApprovalProgress = adminAssetApprovalProgress.NOTHING_CREATED;
    let feeManagerProgress = adminAssetFeeManagerProgress.NOTHING_CREATED;

    // console.log(`loadAllContractData for asset '${baseAsset.address}'`);

    // load agent, ipfsData, AssetContract + dependants
    const assetContractProps = await Promise.all([
        retrieveIPFSData(baseAsset.dataHash, baseAsset),
        loadAssetTokenContractAndDependants(assetContract, web3, approvalState),
        loadFeeManagerContractAndDependants(assetContract, web3, approvalState),
        loadWhitelistContractAndDependants(assetContract, web3, approvalState),
        loadAssetRankTrackerContractAndDependants(assetContract, web3, approvalState),
        callEthereumMethod(assetContract.methods.tokenPercentage())
        ]).catch(error => {
            console.error(`Error whilst running loadAllContractData for asset '${baseAsset.address}'`, error);
            return undefined;
        });
    // console.log('assetContractProps', assetContractProps);

    if(!assetContractProps) {
        console.error("Unable to load assetContractProps");
        return;
    }
    
    const ipfsData = assetContractProps[0];

    // TODO: handle assets where data hash is invalid
    if(!ipfsData) {
        console.warn("Could not load asset data from IPFS hash!");
        return undefined;
    }

    let assetToken = assetContractProps[1];
    let feeManager = assetContractProps[2];
    let whitelist = assetContractProps[3];
    let assetRankTracker = assetContractProps[4];
    const percentBitCar = parseInt(assetContractProps[5]);

    if(approvalState < assetApprovalState.PENDING_AGENT_CONTRACT_APPROVAL) {
        adminApprovalProgress = getAdminApprovalProgress(baseAsset, percentBitCar, assetToken, feeManager);
        feeManagerProgress = getFeeManagerCreationProgress(feeManager);

        switch(adminApprovalProgress) {
            case adminAssetApprovalProgress.NOTHING_CREATED: {
                assetToken = getDefaultAssetTokenData(ipfsData);
                feeManager = getDefaultFeeManagerData(ipfsData);
                whitelist = getDefaultWhitelistData(ipfsData);
                break;
            }
            case adminAssetApprovalProgress.PURCHASE_PERCENTAGE_SET:
            case adminAssetApprovalProgress.ASSET_TOKEN_CREATED: {
                feeManager = getDefaultFeeManagerData(ipfsData);
                whitelist = getDefaultWhitelistData(ipfsData);
                break;
            }
            case adminAssetApprovalProgress.FEE_MANAGER_CREATED: {
                whitelist = getDefaultWhitelistData(ipfsData);
                break;
            }
        }
    }

    return new LoadedAsset(baseAsset, ipfsData, percentBitCar, assetToken, feeManager, whitelist, assetRankTracker);
}

async function retrieveIPFSData(hash, baseAsset) {

    if(!hash || hash.length === 0) {
        return null;
    }

    // TODO: need to sort out default object for unavailable hash / undefined hash
    // TODO: need to define object for timeout on hash (to allow user to manually refresh)
    return await axiosInstance.get(ipfsUrl + hash).catch(error => {
        console.error(`could not load data hash: '${hash}' for asset: '${baseAsset.address}', full url: ${ipfsUrl + hash}`, error);
    }).then(response => response ? processDescription(baseAsset.address, response.data) : undefined);
}

function processDescription (assetAddress, data) {
    try {
        if(!assetAddress || !data || !data.carDescription) {
            console.log('No description');
            return data;
        }

        const overrides = ASSET_DESCRIPTION_OVERRIDE[assetAddress.toLowerCase()];

        if(!overrides) {
            return data;
        }

        let newDescription = data.carDescription;

        overrides.forEach(override => {
            newDescription = data.carDescription.replace(override.current, override.replacement);
        });

        data.carDescription = newDescription;
    } catch (error) {
    }
    
    return data;
}

export async function loadAssetTokenContractAndDependants(assetContract, web3, approvalState) {

    if(approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
        // console.log("loadAssetTokenContractAndDependants | approvalState:", approvalState);
        return null;
    }

    // console.log(`approvalState ${approvalState}, loading loadAssetTokenContractAndDependants`);
    const assetTokenContract = await loadAssetTokenContract(assetContract, web3, approvalState);

    if(!assetTokenContract) {
        return null;
    }

    const assetTokenRequiredData = await loadAssetTokenData(assetTokenContract, approvalState);

    return assetTokenRequiredData;
}

async function loadAssetTokenData(assetTokenContract, approvalState) {

    const assetTokenContractDependants = await Promise.all([
            loadTokenCode(assetTokenContract),
            loadTotalTokenSupply(assetTokenContract),
            callEthereumMethod(assetTokenContract.methods.upperWave()),
            callEthereumMethod(assetTokenContract.methods.lowerWave()),
            loadApprovalDetails(assetTokenContract, approvalState)
        ]).catch(error => {
            console.error(`Error whilst running loadAssetTokenContractDependants for assetToken '${assetTokenContract.address}'`, error);
            return undefined;
        });

    if(assetTokenContractDependants.length != 5) {
        console.error("Unable to load assetTokenContractDependants");
        return;
    }

    const tokenCode = assetTokenContractDependants[0];
    const totalTokenSupply = assetTokenContractDependants[1];
    const tradingPeriodDuration = assetTokenContractDependants[2];
    const votingPeriodDuration = assetTokenContractDependants[3];
    const approvalDateInSeconds = assetTokenContractDependants[4];

    return new TokenContractData(assetTokenContract, tokenCode, totalTokenSupply, tradingPeriodDuration, votingPeriodDuration, approvalDateInSeconds);
}

function getDefaultAssetTokenData(ipfsData) {

    if(!ipfsData) {
        // TODO: handle no IPFS data ??
    }

    const assetTokenContract = null;
    const tokenCode = "UNKNOWN";
    const totalTokenSupply = 1000;
    const tradingPeriodDuration = yearsToSeconds(5);
    const votingPeriodDuration = daysToSeconds(14);
    const approvalDateInSeconds = null;

    return new TokenContractData(assetTokenContract, tokenCode, totalTokenSupply, tradingPeriodDuration, votingPeriodDuration, approvalDateInSeconds);
}



export async function loadAssetTokenContract(assetContract, web3, approvalState) {
    const AssetToken = await import('../../build/contracts/AssetToken.json');
    let assetTokenContract = undefined;

    try {
            const assetTokenContractAddress = await callEthereumMethod(assetContract.methods.getTokenAddress());
            assetTokenContract = isValidContractAddress(assetTokenContractAddress) ? await loadContractIntoWeb3(assetTokenContractAddress, AssetToken, web3) : null;

    } catch (error) {
        assetTokenContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset token contract for asset contract ${assetContract.address}`, error);
        }
    }
    // console.log('resolving assetTokenContract');
    return assetTokenContract;
}



async function loadApprovalDetails(assetTokenContract, approvalState) {

    let approvalDate = null;
    // console.log("loadApprovalDetails - approvalState", approvalState);
    if(approvalState === assetApprovalState.LIVE) {
        approvalDate = await callEthereumMethod(assetTokenContract.methods.birth());
    }

    return approvalDate;
}

async function loadTokenCode(assetTokenContract) {
    const tokenCode = await callEthereumMethod(assetTokenContract.methods.getSymbol());
    return tokenCode;
}

async function loadTotalTokenSupply(assetTokenContract) {
    let tokenSupply = await callEthereumMethod(assetTokenContract.methods.totalSupply());
    return tokenSupply;
}

export async function loadAllAssetContracts(web3) {
    const assetFactory = await import('../../build/contracts/AssetFactory.json');
    const assetFactoryContract = await loadPlatformWeb3Contract(assetFactory, web3);
    const Asset = await import('../../build/contracts/Asset.json');
    return loadFactoryContracts(assetFactoryContract, Asset, web3);
}

async function loadFactoryContracts(factoryContract, objectJson, web3) {
    let loadedContracts = [];
    let factorySize = await callEthereumMethod(factoryContract.methods.size());
    // console.log('factorySize', factorySize);
    for (let i = 0; i < factorySize; i++) {
        let objectAddress = await callEthereumMethod(factoryContract.methods.get(i));

        let excludedContract = EXCLUDED_ASSET_CONTRACTS.find(excludedAddress => doStringsMatchIgnoringCase(excludedAddress, objectAddress));

        if(excludedContract) {
            continue;
        }

        let contract = await loadContractIntoWeb3(objectAddress, objectJson, web3);

        if(contract !== undefined) {
            loadedContracts.push(contract);
        }
    }
    return loadedContracts;
}