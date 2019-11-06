import { convertToSolidityNumber, doesStringContainIgnoringCase, secondsToYears, throwIfUndefined, convertFromSolidityAndFormatForDisplay } from './helpers';
import { setAssetBalance, setUnapprovedAssetAdminApprovalProgress } from '../actions';
import CurrentAssetBalance from '../classes/CurrentAssetBalance';
import * as _ from 'lodash';
import store from '../store';
import BigNumber from 'bignumber.js';
import { callEthereumMethod } from './web3/web3Wrapper';

// From loadedAsset.sol
export const assetApprovalState = {
    PENDING_AGENT_DATA_APPROVAL: 0,
    PENDING_ADMIN_DATA_APPROVAL: 1,
    PENDING_AGENT_CONTRACT_APPROVAL: 2,
    LIVE: 3
};

// Just for UI
export const adminAssetApprovalProgress = {
    NOTHING_CREATED: 0,
    ASSET_TOKEN_CREATED: 1,
    PURCHASE_PERCENTAGE_SET: 2,
    FEE_MANAGER_CREATED: 3,
    WHITELIST_CREATED: 4
};

// Just for UI
export const adminAssetFeeManagerProgress = {
    NOTHING_CREATED: 0,
    FEE_MANAGER_CREATED: 1,
    DEFAULT_FEES_CREATED: 2
};

export const setApprovalState = (assetState) => {
    switch(assetState) {
    case assetApprovalState.PENDING_AGENT_DATA_APPROVAL:
        return 'Pending agent data approval';
    case assetApprovalState.PENDING_ADMIN_DATA_APPROVAL:
        return 'Pending admin data approval';
    case assetApprovalState.PENDING_AGENT_CONTRACT_APPROVAL:
        return 'Pending agent contract approval';
    case assetApprovalState.LIVE:
        return 'Live';
    default:
        return 'Contract state not found';
  }
}

export function getAssetByAddress(loadedAssets, address) {

    try {
        throwIfUndefined(loadedAssets, 'loadedAssets');
        throwIfUndefined(address, 'address');

        let assetFound = loadedAssets[address];
        if (assetFound) {
            return assetFound;
        } 
        
        assetFound = getAssetByTokenAddress(loadedAssets, address);

        if (assetFound) {
            return assetFound;
        } else {
            return null;
        }
    }
    catch (err) {
        console.error("getAssetByAddress", err);
        throw err;
    }
}

function getAssetByTokenAddress(loadedAssets, address) {

    try {
        throwIfUndefined(loadedAssets, 'loadedAssets');
        throwIfUndefined(address, 'address');

        const assetFound = _.find(loadedAssets, asset => asset.assetTokenContract && asset.assetTokenContract.address === address);
        if (assetFound) {
            return assetFound;
        } else {
            return null;
        }
    }
    catch (err) {
        console.error("getAssetByTokenAddress", err);
        throw err;
    }
}

export function getAssetsByTokenCode(loadedAssets, tokenCode) {

    try {
        throwIfUndefined(loadedAssets, 'loadedAssets');
        throwIfUndefined(tokenCode, 'tokenCode');
    
        return _.filter(loadedAssets, loadedAsset => doesStringContainIgnoringCase(loadedAsset.tokenCode, tokenCode));
    }
    catch (err) {
        console.error("getAssetByTokenCode", err);
        throw err;
    }
}

export function getAssetsByMakeOrModel(loadedAssets, text) {

    try {
        throwIfUndefined(loadedAssets, 'loadedAssets');
        throwIfUndefined(text, 'text');
    
        return _.filter(loadedAssets, loadedAsset => loadedAsset.data && doesStringContainIgnoringCase(loadedAsset.data.make + loadedAsset.data.model, text));
    }
    catch (err) {
        console.error("getAssetByMakeOrModel", err);
        throw err;
    }
}

const minOwnershipPercentage = 70;
const maximumCycles = 2;

export async function createToken(assetContract, adminUserAddress, tokenCode, listPriceUSD, msiPerYear, escrowPercent, pafPercent, bitcarPaymentPercent, tradingTimeSeconds, votingTimeSeconds) {

    console.log("Creating token " + tokenCode);

    let totalTokenSupply = convertToSolidityNumber(listPriceUSD);

    console.log("*** PAY STEP *** Creating Asset token");
    await assetContract.methods.createAssetToken(tokenCode, tokenCode, totalTokenSupply, minOwnershipPercentage, tradingTimeSeconds, votingTimeSeconds, maximumCycles).send({from: adminUserAddress});

    let escrow = totalTokenSupply.multipliedBy(escrowPercent.dividedBy(100)).decimalPlaces(0);

    let tradingPeriodYears = secondsToYears(tradingTimeSeconds);

    let msi = convertToSolidityNumber(msiPerYear * tradingPeriodYears);
    let paf = totalTokenSupply.multipliedBy(pafPercent.dividedBy(100));

    console.log("Trading period in years", tradingPeriodYears);
    console.log("Escrow Total: $", convertFromSolidityAndFormatForDisplay(escrow, 0));
    console.log("MSI Total: $", convertFromSolidityAndFormatForDisplay(msi, 0));
    console.log("PAF Total: $", convertFromSolidityAndFormatForDisplay(paf, 0));

    console.log("Escrow per token: $", convertFromSolidityAndFormatForDisplay(escrow.dividedBy(listPriceUSD), 0));
    console.log("MSI per token: $", convertFromSolidityAndFormatForDisplay(msi.dividedBy(listPriceUSD), 0));
    console.log("PAF per token: $", convertFromSolidityAndFormatForDisplay(paf.dividedBy(listPriceUSD), 0));

    console.log("*** PAY STEP *** Creating Asset fees");
    await assetContract.methods.createAssetFees(escrow.toString(), msi.toString(), paf.toString()).send({from:adminUserAddress});

    let ethPercent = 100 - bitcarPaymentPercent;
    console.log(`*** PAY STEP *** Setting purchase type percentages ETH:${ethPercent}% BITCAR:${bitcarPaymentPercent}%`);
    await assetContract.methods.setPurchasePercentages(bitcarPaymentPercent.toString(), ethPercent.toString()).send({ from: adminUserAddress });
}

export function getAdminApprovalProgress(baseAsset, tokenBitCarPercent, loadedAssetTokenAndDependants, loadedFeeManagerContractAndDependants) {
    if(baseAsset.approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL || !loadedAssetTokenAndDependants) {
        return adminAssetApprovalProgress.NOTHING_CREATED;
    }

    if(!tokenBitCarPercent || tokenBitCarPercent.isEqualTo(0)) {
        return adminAssetApprovalProgress.ASSET_TOKEN_CREATED;
    }

    if(!loadedFeeManagerContractAndDependants) {
        return adminAssetApprovalProgress.PURCHASE_PERCENTAGE_SET;
    }

    // TODO: Wire-up whitelist
    // if(!loadedWhitelistContractAndDependants) {
    //     return adminAssetApprovalProgress.FEE_MANAGER_CREATED;
    // }

    return adminAssetApprovalProgress.WHITELIST_CREATED;
}

export function getCurrentAdminApprovalProgress(loadedAsset) {
    return getAdminApprovalProgress(loadedAsset, loadedAsset.tokenBitCarPercent, loadedAsset.assetTokenContract, loadedAsset.feeManagerContract);
}

export function setCurrentAdminApprovalProgress(loadedAsset) {
    const currentProgress = getCurrentAdminApprovalProgress(loadedAsset);

    if(loadedAsset.adminApprovalProgress !== currentProgress) {
        store.dispatch(setUnapprovedAssetAdminApprovalProgress(loadedAsset.address, currentProgress));
    }
}

export async function loadCurrentAssetBalance(asset, platformTokenContract) {

    let hasErrored = false;

    let platformTokenBalance = new BigNumber(0);
    let platformEscrowBalance = new BigNumber(0);

    const balances = await Promise.all([
        callEthereumMethod(asset.assetTokenContract.methods.balanceOf(asset.address)),
        callEthereumMethod(platformTokenContract.methods.balanceOf(asset.beeContract.address))
    ]).catch(error => {
        console.error(`Error retrieving current asset balance for ${asset.address}`, error);
        hasErrored = true;
    });

    platformTokenBalance = new BigNumber(hasErrored ? NaN : balances[0]);
    platformEscrowBalance = new BigNumber(hasErrored ? NaN : balances[1]);

    store.dispatch(setAssetBalance(new CurrentAssetBalance(asset.address, asset.totalTokenSupply, platformEscrowBalance, platformTokenBalance)));
}
