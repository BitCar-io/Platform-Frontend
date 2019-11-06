import { loadContractIntoWeb3, isValidContractAddress } from '../util/web3/contracts';
import FeeManagerData from '../classes/FeeManagerData';
import { assetApprovalState, adminAssetFeeManagerProgress } from '../util/assetHelpers';
import { convertFromSolidityNumber } from '../util/helpers';
import { callEthereumMethod } from '../util/web3/web3Wrapper';

async function loadFeeManagerContract(assetContract, web3, approvalState) {
    const FeeManager = await import('../../build/contracts/FeeManager.json');

    let feeManagerContract = undefined;

    try {
            const feeManagerContractAddress = await callEthereumMethod(assetContract.methods.getFeeManagerAddress());
            feeManagerContract = isValidContractAddress(feeManagerContractAddress) ? await loadContractIntoWeb3(feeManagerContractAddress, FeeManager, web3) : null;

    } catch (error) {
        feeManagerContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset fee manager contract for asset contract ${assetContract.address}`, error);
        }
    }
    // console.log('resolving feeManagerContract');
    return feeManagerContract;
}

export async function loadFeeManagerContractAndDependants(assetContract, web3, approvalState) {

    if(approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
        return null;
    }

    const feeManagerContract = await loadFeeManagerContract(assetContract, web3, approvalState);

    if(!feeManagerContract) {
        return null;
    }

    return await loadFeeManagerData(feeManagerContract, web3, approvalState);
}

async function loadFeeManagerData(feeManagerContract, web3, approvalState) {
    let feeManagerContractDependants = await Promise.all([
        callEthereumMethod(feeManagerContract.methods.getAmount('BEE')),
        callEthereumMethod(feeManagerContract.methods.getAmount('MSI')),
        callEthereumMethod(feeManagerContract.methods.getAmount('PAF')),
        callEthereumMethod(feeManagerContract.methods.getAmount('PTF')),
        loadBeeContract(feeManagerContract, web3, approvalState)
    ]).catch(error => {
        console.error(`Error whilst running loadFeeManagerContractDependants for feeManager '${feeManagerContract.address}'`, error);
        return undefined;
    });

    const totalEscrow = feeManagerContractDependants[0];
    const totalMSI = feeManagerContractDependants[1];
    const totalPAF = feeManagerContractDependants[2];
    const totalPTF = feeManagerContractDependants[3];
    const beeContract = feeManagerContractDependants[4];

    const fmd = new FeeManagerData(feeManagerContract, beeContract, totalEscrow, totalMSI, totalPAF, totalPTF);
    return fmd;
}

export function getDefaultFeeManagerData(ipfsData) {

    if(!ipfsData) {
        // TODO: handle no IPFS data ??
    }

    const totalEscrow = 0;
    const totalMSI = 0;
    const totalPAF = 0;
    const totalPTF = 0;

    return new FeeManagerData(null, null, totalEscrow, totalMSI, totalPAF, totalPTF);
}

export function getFeeManagerCreationProgress(feeManagerData) {
    if(!feeManagerData || !feeManagerData.feeManagerContract) {
        return adminAssetFeeManagerProgress.NOTHING_CREATED;
    }

    return adminAssetFeeManagerProgress.DEFAULT_FEES_CREATED;
}

async function loadBeeContract(feeManagerContract, web3, approvalState) {
    const Bee = await import('../../build/contracts/BEE.json');

    let beeContract = undefined;

    try {
            const beeContractAddress = await callEthereumMethod(feeManagerContract.methods.getAddress('BEE'));
            beeContract = isValidContractAddress(beeContractAddress) ? await loadContractIntoWeb3(beeContractAddress, Bee, web3) : null;

    } catch (error) {
        beeContract = null;
        if(approvalState > assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
            // TODO: something here if we want to - there has been an actual error
            console.error(`Error whilst loading asset bee contract from fee manager contract ${feeManagerContract.address}`, error);
        }
    }
    // console.log('resolving beeContract');
    return beeContract;
}