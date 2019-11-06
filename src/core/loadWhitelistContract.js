import { loadContractIntoWeb3, isValidContractAddress } from '../util/web3/contracts';
import { assetApprovalState } from '../util/assetHelpers';
import WhitelistContractData from '../classes/WhitelistContractData';
import { callEthereumMethod } from '../util/web3/web3Wrapper';

export async function loadWhitelistContractAndDependants(assetContract, web3, approvalState) {

    if(approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
        // console.log("loadWhitelistContractAndDependants | approvalState:", approvalState);
        return null;
    }

    // console.log(`approvalState ${approvalState}, loading loadWhitelistContractAndDependants`);
    const whitelistContract = await loadWhitelistContract(assetContract, web3, approvalState);

    if(!whitelistContract) {
        return null;
    }

    return await loadWhitelistData(whitelistContract, approvalState);
}

async function loadWhitelistContract(assetContract, web3, approvalState) {
    const AssetWhitelist = await import('../../build/contracts/AssetWhitelist.json');
    let whitelistContract = undefined;

    try {
            const whitelistContractAddress = await callEthereumMethod(assetContract.methods.getWhitelistAddress());
            whitelistContract = isValidContractAddress(whitelistContractAddress) ? await loadContractIntoWeb3(whitelistContractAddress, AssetWhitelist, web3) : null;

    } catch (error) {
        whitelistContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset whitelist contract for asset contract ${assetContract.address}`, error);
        }
    }
    // console.log('resolving whitelistContract');
    return whitelistContract;
}

async function loadWhitelistData(whitelistContract) {

    const whitelistContractDependants = await Promise.all([
            callEthereumMethod(whitelistContract.methods.getEnabled()),
            callEthereumMethod(whitelistContract.methods.getInitialPurchases()),
            callEthereumMethod(whitelistContract.methods.getP2PTransfers()),
            callEthereumMethod(whitelistContract.methods.getClaimerTransfers()),
            callEthereumMethod(whitelistContract.methods.getCountries())
        ]).catch(error => {
            console.error(`Error whilst running loadWhitelistData for assetToken '${whitelistContract.address}'`, error);
            return undefined;
        });

    const isEnabled = whitelistContractDependants[0];
    const isUsedForInitialPurchases = whitelistContractDependants[1];
    const isUsedForP2PTransfers = whitelistContractDependants[2];
    const isUsedForClaimerTransfers = whitelistContractDependants[3];
    const allowedCountries = whitelistContractDependants[4];

    return new WhitelistContractData(whitelistContract, isEnabled, isUsedForInitialPurchases, isUsedForClaimerTransfers, isUsedForP2PTransfers, allowedCountries);
}

export function getDefaultWhitelistData(ipfsData) {

    if(!ipfsData) {
        // TODO: handle no IPFS data ??
    }

    const isEnabled = false;
    const isUsedForInitialPurchases = false;
    const isUsedForP2PTransfers = false;
    const isUsedForClaimerTransfers = false;
    const allowedCountries = [];

    return new WhitelistContractData(null, isEnabled, isUsedForInitialPurchases, isUsedForClaimerTransfers, isUsedForP2PTransfers, allowedCountries);
}