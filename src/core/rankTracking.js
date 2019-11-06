import { getOrLoadPlatformContract, isValidContractAddress, loadContractIntoWeb3 } from '../util/web3/contracts';
import { assetApprovalState } from '../util/assetHelpers';
import * as _ from 'lodash';
import AssetRankTrackerContractData from '../classes/RankTracker/AssetRankTrackerContractData';
import AssetLimit from '../classes/RankTracker/AssetLimit';
import { callEthereumMethod } from '../util/web3/web3Wrapper';

// index of text denotes rank level in Blockchain
export const RANK_LEVELS = [
    "Bronze",
    "Silver",
    "Gold"
];

export const RANK_LEVELS_LOWERCASE = RANK_LEVELS.map(rank => rank.toLowerCase());

export async function loadPlatformRankTracker(web3) {

    let rankTrackerContract = undefined;

    try {
        rankTrackerContract = await getOrLoadPlatformContract('RankTracker', web3);

    } catch (error) {
        rankTrackerContract = null;
        console.error("Error whilst loading platform RankTracker contract.", error);
    }

    // console.log('resolving rankTrackerContract');
    return rankTrackerContract;
}

export async function getUserRank(web3, coinbase) {
    const rankTrackerContract = await loadPlatformRankTracker(web3);

    return await rankTrackerContract.methods.getUserRank(coinbase).call({from: coinbase});
}

export async function loadAssetRankTrackerContractAndDependants(assetContract, web3, approvalState) {

    if(approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
        return null;
    }

    const assetRankTrackerContract = await loadAssetRankTrackerContract(assetContract, web3, approvalState);

    if(!assetRankTrackerContract) {
        return null;
    }

    const assetLimits = await loadAssetRankTrackerData(assetRankTrackerContract);

    return new AssetRankTrackerContractData(assetRankTrackerContract, assetLimits);
}

async function loadAssetRankTrackerContract(assetContract, web3, approvalState) {

    const assetRankTracker = await import('../../build/contracts/AssetRankTracker.json');
    
    let assetRankTrackerContract = undefined;

    try {
            const assetRankTrackerContractAddress = await callEthereumMethod(assetContract.methods.getAssetRankTrackerAddress());
            assetRankTrackerContract = isValidContractAddress(assetRankTrackerContractAddress) ? await loadContractIntoWeb3(assetRankTrackerContractAddress, assetRankTracker, web3) : null;

    } catch (error) {
        assetRankTrackerContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset rank tracker contract for asset contract ${assetContract.address}`, error);
        }
    }
    // console.log('resolving rankTrackerContract');
    return assetRankTrackerContract;
}

async function loadAssetRankTrackerData(assetRankTrackerContract) {

    let callsToMake = [];

    _.forEach(RANK_LEVELS, (rankName, rank) => {
        callsToMake.push(callEthereumMethod(assetRankTrackerContract.methods.limits(rank)).then(result => {
            return new AssetLimit(rank, result.period, result.periodLimit, result.periodUsage, result.lastUpdate);
        }));
    });

    let assetRanks = await Promise.all(callsToMake).catch(error => {
        console.error(`Error whilst running loadAssetRankTrackerData for assetRankTracker '${assetRankTrackerContract.address}'`, error);
        return undefined;
    });

    return assetRanks;
}