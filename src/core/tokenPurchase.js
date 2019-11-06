import React from 'react';
import { convertToSolidityNumber, convertFromSolidityNumber, convertFromSolidityAndFormatForDisplay, checkAccessCriteria } from '../util/helpers';
import { getOrLoadPlatformContract, usdToBitCar, usdToEth } from "../util/web3/contracts";
import {sendTransaction, callEthereumMethod, processError} from '../util/web3/web3Wrapper';
import store from '../store';
import BigNumber from 'bignumber.js';
import Fees from '../classes/Fees';
import ErrorWrapper from '../classes/ErrorWrapper';
import {BUY_TOKENS_ASSET_MEMBERSHIP_LIMIT_REACHED, BUY_TOKENS_USER_PERIOD_LIMIT_REACHED, BUY_TOKENS_BITCAR_LOW, BUY_TOKENS_ASSET_NOT_LIVE, BUY_TOKENS_ETHEREUM_LOW, BUY_TOKENS_ASSET_BALANCE_LOW, WHITELIST_BUY_INVALID, BUY_TOKENS_QTY_TOO_LOW, BUY_TOKENS_PLATFORM_MEMBERSHIP_LIMIT_REACHED} from '../util/web3/errorMessaging';
import { assetApprovalState } from '../util/assetHelpers';
import Web3SendResponse from '../classes/Web3SendResponse';
import { refreshTicker } from './tickerRunner';
import { RANK_LEVELS } from './rankTracking';
import AssetLimit from '../classes/RankTracker/AssetLimit';
import RankLimitDisplay from '../components/RankLimitDisplay';
import GlobalLimit from '../classes/RankTracker/GlobalLimit';

let bitcarTokenContract;
let whitelistContract;

const MINIMUM_WEI_FOR_PURCHASE = new BigNumber(1);

export async function getBitCarContract(web3) {

    if(!bitcarTokenContract) {
        bitcarTokenContract = await getOrLoadPlatformContract("PlatformToken", web3);
    }

    return bitcarTokenContract;
}

export async function getWhitelistContract(web3) {

    if(!whitelistContract) {
        whitelistContract = await getOrLoadPlatformContract("Whitelist", web3);
    }

    return whitelistContract;
}

export async function doesAllowanceNeedToBeSet(web3, coinbase, assetContractAddress, totalBitCar) {

    if(!totalBitCar || !BigNumber.isBigNumber(totalBitCar) || totalBitCar.isNaN()) {
        throw new Error("doesAllowanceNeedToBeSet expects a valid BigNumber object for parameter 'totalBitCar'");
    }

    const platformTokenContract = await getBitCarContract(web3);

    const currentAllowance = await callEthereumMethod(platformTokenContract.methods.allowance(coinbase, assetContractAddress), {from: coinbase});
    //console.log('current allowance', currentAllowance);

    return totalBitCar.isGreaterThan(currentAllowance);
}

export async function setAllowance(web3, coinbase, assetContractAddress, totalBitCar) {
    const platformTokenContract = await getBitCarContract(web3);

    const roundedBitCar = totalBitCar.toFixed(0, BigNumber.ROUND_UP);

    // console.log(`Setting allowance for BitCar. Rounding ${totalBitCar} to :`, roundedBitCar);

    return await sendTransaction(true, web3, platformTokenContract.methods.approve(assetContractAddress, roundedBitCar), {from: coinbase});
}

export async function transferTokens(web3, coinbase, asset, qty, totalEthereum) {

    return new Promise(async (resolve, reject) => {

        // console.log('coinbase', coinbase)
        // console.log('asset', asset)
        // console.log('qty', qty)
        // console.log('totalEthereum', totalEthereum)

        // value must be defaulted to the smallest value as the function is 'payable' so requires ether
        const purchaseArguments = getPurchaseArguments(web3, coinbase, qty, totalEthereum);

        await isPurchaseValid(web3, coinbase, asset, qty, totalEthereum).then(() => {
            sendTransaction(false, web3, asset.assetContract.methods.buyAssetTokens(purchaseArguments.solidityQty.toString()), purchaseArguments.sendArguments)
            .then(result => resolve(result))
            .catch(error => reject(error));
        }).catch(errorValidation => {
            reject(new Web3SendResponse(null, errorValidation, false));
        });
    
    });
}

export async function isWhitelistValid(web3, coinbase, asset) {
    return await isCorrectWhitelist(web3, coinbase, asset.isWhitelistEnabled, asset.isWhitelistUsedForInitialPurchases, asset.whitelistedCountries);
}

async function isCorrectWhitelist(web3, coinbase, isWhitelistEnabled, isWhitelistUsedForInitialPurchases, whitelistedCountries) {

    if(isWhitelistEnabled === false || isWhitelistUsedForInitialPurchases === false) {
        return true;
    }

    const whitelistContract = await getWhitelistContract(web3);

    // console.log('Asset Whitelist', whitelistedCountries);

    // let isWhitelisted;

    // let coldWallet = store.getState().UIstate.currentUser.coldWallet;

    // whitelistedCountries.push(0);

    // for (let index = 0; index < whitelistedCountries.length; index++) {
    //     const country = whitelistedCountries[index];

    //     isWhitelisted = await callEthereumMethod(whitelistContract.methods.isWhitelisted(coldWallet, [country]));
        
    //     console.log(`User coldWallet Whitelisted ${country}`, isWhitelisted);   
    // }

    return await callEthereumMethod(whitelistContract.methods.isWhitelisted(coinbase, whitelistedCountries));
}

function getPurchaseArguments(web3, coinbase, qty, totalEthereum) {

    // we have to set to a maximum of 18 decimals as higher is not supported for conversion.
    const ethNumber = convertFromSolidityNumber(totalEthereum).toFormat(18);

    // value must be defaulted to the smallest value as the function is 'payable' so requires ether
    const valueToSend = new BigNumber(totalEthereum && totalEthereum > 0 ? web3.utils.toWei(ethNumber) : MINIMUM_WEI_FOR_PURCHASE);

    // if(valueToSend.isGreaterThan(MINIMUM_WEI_FOR_PURCHASE)) {
    //     console.log(`buying with some ethereum (${ethNumber.toString()}) | in Wei: ${valueToSend.toString()}`, totalEthereum);
    // }

    return {solidityQty: new BigNumber(convertToSolidityNumber(qty)), sendArguments: {from: coinbase, value: valueToSend}};
}

export async function isCreditCardPurchaseValid(asset, qty) {

    return new Promise(async (resolve, reject) => {

        const carValidation = await validateCar(asset, new BigNumber(convertToSolidityNumber(qty)));

        if(!carValidation.isValid) {
            // reject
            console.error("Car Validation failed");
            reject(new Web3SendResponse(null, carValidation.validationErrors, false));
            return;
        }

        const locationValidation = await checkAccessCriteria(false);

        if(!locationValidation.result) {
            console.error("Location Validation failed");
            reject(new Web3SendResponse(null, [locationValidation.error]))
        }

        resolve();
    });
}

export async function isPurchaseValid(web3, coinbase, asset, qty, totalEthereum) {

    return new Promise(async (resolve, reject) => {
        const purchaseArguments = getPurchaseArguments(web3, coinbase, qty, totalEthereum);

        const carValidation = await validateCar(asset, purchaseArguments.solidityQty);

        if(!carValidation.isValid) {
            // reject
            console.error("Car Validation failed");
            reject(new Web3SendResponse(null, carValidation.validationErrors, false));
            return;
        }

        const liveFees = await getLiveTickerFees(web3, asset, qty);
        // console.log("Live Fees", liveFees);

        const userValidation = await validateUser(web3, liveFees, asset, purchaseArguments);

        if(!userValidation.isValid) {
            // reject
            console.error("User Validation failed");
            reject(new Web3SendResponse(null, userValidation.validationErrors, false));
            return;
        }

        const locationValidation = await checkAccessCriteria(false);

        if(!locationValidation.result) {
            console.error("Location Validation failed");
            reject(new Web3SendResponse(null, [locationValidation.error]))
        }

        resolve();
    });
}

export async function getLiveTickerFees(web3, asset, qty) {
    const currentRates = await refreshTicker(web3);

    // console.log("Live ETH Price:", currentRates.ethUsd);
    // console.log("Live BITCAR Price:", currentRates.bitcarUsd);

    return new Fees(qty, asset.pafPerToken, asset.escrowPerToken, asset.ptfPerToken, currentRates.bitcarUsd, currentRates.ethUsd, asset.tokenBitCarPercent, asset.tokenEthereumPercent, asset.requiresEth);
}

async function validateUser(web3, liveFees, asset, purchaseArguments) {
    const assetRankTrackerMethods = asset.assetRankTracker.contract.methods;
    const coinbase = purchaseArguments.sendArguments.from;
    const platformTokenMethods = store.getState().UIstate.platformTokenContract.methods;

    let hasErrored = false;

    const validationChecks = await Promise.all([
        callEthereumMethod(platformTokenMethods.balanceOf(coinbase)),                                           // get current BitCar balance
        isCurrentWhitelistValid(web3, coinbase, asset),                                            // check whitelist
        web3.eth.getBalance(coinbase),                                                             // get current Wei balance for user
        validatePlatformLimits(web3, coinbase, assetRankTrackerMethods, purchaseArguments.solidityQty)    // check limits
    ]).catch(error => {
        console.error("Error validating user for purchasing.", error);
        hasErrored = true;
    });

    if(hasErrored) {
        return {isValid: isValid, validationErrors: [new ErrorWrapper('Unexpected Error')]};
    }

    // const validatePeriodResult = validationChecks[0];
    // const validateUserResult = validationChecks[1];
    const bitCarBalance = new BigNumber(validationChecks[0]);
    const isWhitelistOk = new BigNumber(validationChecks[1]);
    const weiBalance = new BigNumber(validationChecks[2]);
    const limitResult = validationChecks[3];
    const ethBalance = convertToSolidityNumber(new BigNumber(web3.utils.fromWei(weiBalance === 0 ? MINIMUM_WEI_FOR_PURCHASE : weiBalance.toFixed(0))));
    const hasCorrectBitCarBalance = bitCarBalance.isGreaterThanOrEqualTo(liveFees.totalBitCar);
    const hasCorrectEthBalance = ethBalance.isGreaterThanOrEqualTo(liveFees.totalEthereum);

    let validationErrors = [];
    let isValid = true;

    if(!limitResult.isValid) {
        limitResult.validationErrors.forEach(error => validationErrors.push(error));
        isValid = false;
    }

    if(!hasCorrectBitCarBalance) {
        // console.log("Bitcar Balance:", bitCarBalance);
        // console.log("Bitcar Required:", liveFees.totalBitCar);
        // console.log("Live Fees", liveFees);
        validationErrors.push(new ErrorWrapper(BUY_TOKENS_BITCAR_LOW));
        isValid = false;
    }

    if(!isWhitelistOk) {
        validationErrors.push(new ErrorWrapper(WHITELIST_BUY_INVALID));
        isValid = false;
    }

    if(!hasCorrectEthBalance) {
        // console.log("Eth Balance:", ethBalance);
        // console.log("Eth Required:", liveFees.totalEthereum);
        // console.log("Live Fees", liveFees);
        validationErrors.push(new ErrorWrapper(BUY_TOKENS_ETHEREUM_LOW));
        isValid = false;
    }

    return {isValid: isValid, validationErrors: validationErrors};
}

async function validateCar(asset, solidityQty) {

    const assetMethods = asset.assetContract.methods;
    const assetTokenMethods = asset.assetTokenContract.methods;

    let hasErrored = false;

    const validationChecks = await Promise.all([
        callEthereumMethod(assetMethods.state()),                          // check state is purchasable
        callEthereumMethod(assetTokenMethods.isInUpperWave()),             // check we are in a trading wave
        callEthereumMethod(assetTokenMethods.balanceOf(asset.address)),    // get remaining token balance
        callEthereumMethod(assetMethods.minPurchaseAmount())               // get minimum purchase limit
    ]).catch(error => {
        console.error("Error validating car for purchasing.", error);
        hasErrored = true;
    });

    if(hasErrored) {
        return {isValid: isValid, validationErrors: [new ErrorWrapper('Unexpected Error')]};
    }

    const assetState = validationChecks[0];
    const isTradeable = validationChecks[1];
    const currentBalance = validationChecks[2];
    const minimumPurchase = validationChecks[3];
    const hasBalance = solidityQty.isLessThanOrEqualTo(currentBalance);

    let validationErrors = [];
    let isValid = true;

    if(assetState < assetApprovalState.LIVE || !isTradeable) {
        validationErrors.push(new ErrorWrapper(BUY_TOKENS_ASSET_NOT_LIVE));
        isValid = false;
    }

    if(!hasBalance) {
        // console.log('Balance of Asset:', currentBalance);
        // console.log('Balance to Buy  :', solidityQty);
        validationErrors.push(new ErrorWrapper(BUY_TOKENS_ASSET_BALANCE_LOW));
        isValid = false;
    }

    if(!solidityQty.isGreaterThanOrEqualTo(getMinimumPurchaseQty(minimumPurchase, currentBalance))) {
        validationErrors.push(new ErrorWrapper(BUY_TOKENS_QTY_TOO_LOW));
        isValid = false;
    }

    return {isValid: isValid, validationErrors: validationErrors};
}

async function validatePlatformLimits(web3, coinbase, assetRankTrackerMethods, solidityQty) {

    const userLimit = await callEthereumMethod(assetRankTrackerMethods.getUserRankLimits(coinbase));
    const membershipLimit = await callEthereumMethod(assetRankTrackerMethods.getRankLimits(userLimit.rank));
    const platformAssetLimit = await getGlobalLimit(web3, coinbase, userLimit.rank);

    const userAssetLimit = new AssetLimit(userLimit.rank, userLimit.period, userLimit.periodUserLimit, userLimit.periodUsage, userLimit.lastUpdate);
    const membershipAssetLimit = new AssetLimit(userLimit.rank, membershipLimit.period, membershipLimit.periodLimit, membershipLimit.periodUsage, membershipLimit.lastUpdate);

    let errorDisplayComponent = <RankLimitDisplay rank={userAssetLimit.rank} buyQty={convertFromSolidityAndFormatForDisplay(solidityQty, 0)} />;

    // console.log('User Limits', userLimit);
    // console.log('User Limit Obj', userAssetLimit);
    // console.log('Membership Limits', membershipLimit);
    // console.log('Membership Limit Obj', membershipAssetLimit);
    // console.log('Purchase amount solidity', solidityQty);

    let validationErrors = [];
    let isValid = true;

    if(!platformAssetLimit.canBuy(solidityQty)) {

        errorDisplayComponent = React.cloneElement(errorDisplayComponent, {platformLimit: platformAssetLimit});

        validationErrors.push(new ErrorWrapper(BUY_TOKENS_PLATFORM_MEMBERSHIP_LIMIT_REACHED, errorDisplayComponent));
        isValid = false;
        return {isValid: isValid, validationErrors: validationErrors};
    }

    const hasPeriodStarted = membershipAssetLimit && membershipAssetLimit.hasPeriodStarted;
    const resetTime = membershipAssetLimit && membershipAssetLimit.getTimeToReset();

    if(!membershipAssetLimit.canBuy(solidityQty)) {

        errorDisplayComponent = React.cloneElement(errorDisplayComponent, {
            memberLimit: membershipAssetLimit,
            hasPeriodStarted: hasPeriodStarted,
            resetTime: resetTime
        });

        validationErrors.push(new ErrorWrapper(BUY_TOKENS_ASSET_MEMBERSHIP_LIMIT_REACHED, errorDisplayComponent));
        isValid = false;
        return {isValid: isValid, validationErrors: validationErrors};
    }

    if(!userAssetLimit.canBuy(solidityQty)) {

        errorDisplayComponent = React.cloneElement(errorDisplayComponent, {
            userLimit: userAssetLimit,
            hasPeriodStarted: hasPeriodStarted,
            resetTime: resetTime
        });

        validationErrors.push(new ErrorWrapper(BUY_TOKENS_USER_PERIOD_LIMIT_REACHED, errorDisplayComponent));
        isValid = false;
        return {isValid: isValid, validationErrors: validationErrors};
    }

    return {isValid: isValid, validationErrors: validationErrors};
}

async function isCurrentWhitelistValid(web3, coinbase, asset) {
    const assetWhitelistMethods = asset.whitelistContract.methods;
    const currentCarStatus = await Promise.all([
        callEthereumMethod(assetWhitelistMethods.getEnabled()),
        callEthereumMethod(assetWhitelistMethods.getInitialPurchases()),
        callEthereumMethod(assetWhitelistMethods.getCountries())
    ]);

    return await isCorrectWhitelist(web3, coinbase, currentCarStatus[0], currentCarStatus[1], currentCarStatus[2]);
}

async function getGlobalLimit(web3, coinbase, rank) {
    const rankTrackerContract = await getOrLoadPlatformContract('RankTracker', web3);

    let globalLimits = await Promise.all([
        callEthereumMethod(rankTrackerContract.methods.getGlobalLimit(rank)),
        callEthereumMethod(rankTrackerContract.methods.getUserGlobalUsage(coinbase))
    ]);

    return new GlobalLimit(rank, new BigNumber(globalLimits[0]), new BigNumber(globalLimits[1]));
}

export function getMinimumPurchaseQty(minimumPurchase, currentBalance) {

    const currBal = new BigNumber(currentBalance);
    const minPurchase = new BigNumber(minimumPurchase);

    return currBal.isGreaterThanOrEqualTo(minPurchase) ? minPurchase : currBal;
}
