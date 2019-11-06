import { loadContractIntoWeb3, isValidContractAddress } from '../util/web3/contracts';
import { assetApprovalState } from '../util/assetHelpers';
import AssetControlBallotContractData from '../classes/AssetControlBallotContractData';
import { callEthereumMethod } from '../util/web3/web3Wrapper';

export async function loadAssetControlBallotContractAndDependants(assetContract, web3, approvalState) {

    if(approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
        // console.log("loadAssetControlBallotContractAndDependants | approvalState:", approvalState);
        return null;
    }

    // console.log(`approvalState ${approvalState}, loading loadAssetControlBallotContractAndDependants`);
    const assetControlBallotContract = await loadAssetControlBallotContract(assetContract, web3, approvalState);

    if(!assetControlBallotContract) {
        return null;
    }

    return await loadAssetControlBallotData(assetControlBallotContract, approvalState);
}

async function loadAssetControlBallotContract(assetContract, web3, approvalState) {
    const AssetAssetControlBallot = await import('../../build/contracts/AssetControlBallot.json');
    let assetControlBallotContract = undefined;

    try {
            const assetControlBallotContractAddress = await callEthereumMethod(assetContract.methods.getAssetControlBallotAddress());
            assetControlBallotContract = isValidContractAddress(assetControlBallotContractAddress) ? await loadContractIntoWeb3(assetControlBallotContractAddress, AssetAssetControlBallot, web3) : null;

    } catch (error) {
        assetControlBallotContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset AssetControlBallot contract for asset contract ${assetContract.address}`, error);
        }
    }
    // console.log('resolving assetControlBallotContract');
    return assetControlBallotContract;
}

async function loadAssetControlBallotData(assetControlBallotContract) {

    const assetControlBallotContractDependants = await Promise.all([
            callEthereumMethod(assetControlBallotContract.methods.voteCosts())
        ]).catch(error => {
            console.error(`Error whilst running loadAssetControlBallotData contract address '${assetControlBallotContract.address}'`, error);
            return undefined;
        });

    const voteCancellationCost = assetControlBallotContractDependants[0].voteCancellationCost;
    const voteCastCost = assetControlBallotContractDependants[0].voteCastCost;
    const voteCreationCost = assetControlBallotContractDependants[0].voteCreationCost;

    return new AssetControlBallotContractData(assetControlBallotContract, voteCreationCost, voteCastCost, voteCancellationCost);
}

export function getDefaultAssetControlBallotData(ipfsData) {

    if(!ipfsData) {
        // TODO: handle no IPFS data ??
    }

    const voteCancellationCost = 0;
    const voteCastCost = 0;
    const voteCreationCost = 0;

    return new AssetControlBallotContractData(null, voteCreationCost, voteCastCost, voteCancellationCost);
}