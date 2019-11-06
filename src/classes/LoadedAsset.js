import { convertFromSolidityNumber, getDateDifferenceString, convertFromSolidityAndFormatForDisplay } from '../util/helpers';
import { getCurrentAdminApprovalProgress } from '../util/assetHelpers';
import BaseAssetData from "./BaseAssetData";
import FeeManagerData from '../classes/FeeManagerData';
import TokenContractData from '../classes/TokenContractData';
import WhitelistContractData from '../classes/WhitelistContractData';
import { getFeeManagerCreationProgress } from '../core/loadFeeManagerContract';
import AssetRankTrackerContractData from './RankTracker/AssetRankTrackerContractData';
import BigNumber from 'bignumber.js';

export default class LoadedAsset extends BaseAssetData {

    data;
    assetTokenContract;
    assetTokenContractAddress;
    feeManagerContract;
    tokenCode;
    totalTokenSupply;
    totalTokenSupplyDisplay;
    listedValueUsdDisplay;
    tradingPeriodDuration;
    votingPeriodDuration;
    totalEscrow;
    totalMSI;
    totalPAF;
    totalPTF;
    escrowRateDisplay;
    msiRateDisplay;
    pafRateDisplay;
    ptfRateDisplay;
    escrowPerToken;
    msiPerToken;
    pafPerToken;
    ptfPerToken;
    appreciationPercent;
    tokenBitCarPercent;
    tokenEthereumPercent;
    requiresEth;

    approvalDate;
    tradingEndDate;
    votingEndDate;
    termString;

    // whitelist
    whitelistContract;
    isWhitelistEnabled;
    isWhitelistUsedForInitialPurchases;
    isWhitelistUsedForClaimerTransfers;
    isWhitelistUsedForP2PTransfers;
    whitelistedCountries;

    // asset Rankings
    assetRankTracker;

    // UI variables
    adminApprovalProgress = 0;
    adminFeeManagerProgress = 0;

    constructor(unloadedAsset, ipfsData, tokenBitCarPercent, assetTokenData, feeManagerData, whitelistData, assetRankTrackerData) {
        super(unloadedAsset.assetContract, unloadedAsset.agent, unloadedAsset.approvalState, unloadedAsset.dataHash, unloadedAsset.adminRejectionCount, unloadedAsset.agentRejectionCount, unloadedAsset.minPurchaseAmount)

        this.data = ipfsData;
        this.setBitcarPercent(tokenBitCarPercent);
        this.setAssetTokenData(assetTokenData);
        this.setFeeManagerData(feeManagerData);
        this.setWhitelistData(whitelistData);
        this.setAssetRankTrackerData(assetRankTrackerData);
        this.adminApprovalProgress = getCurrentAdminApprovalProgress(this);
        this.adminFeeManagerProgress = getFeeManagerCreationProgress(feeManagerData);
    }

    setBitcarPercent(tokenBitCarPercent) {

        if(!tokenBitCarPercent) {
            this.tokenBitCarPercent = 0;
        }

        this.tokenBitCarPercent = new BigNumber((tokenBitCarPercent / 100));
        this.tokenEthereumPercent = new BigNumber(1 - this.tokenBitCarPercent);
        this.requiresEth = this.tokenEthereumPercent.isGreaterThan(0);
    }

    setApprovalDate(dateInSeconds) {

        if (!dateInSeconds) {
            return null;
        }

        let approvalDate = new Date(dateInSeconds * 1000);

        this.tradingEndDate = new Date();
        this.tradingEndDate.setSeconds(approvalDate.getSeconds() + +this.tradingPeriodDuration);

        this.votingEndDate = new Date();
        this.votingEndDate.setSeconds(this.tradingEndDate.getSeconds() + +this.votingPeriodDuration);

        this.termString = getDateDifferenceString(approvalDate, this.tradingEndDate);

        return approvalDate;
    }

    setAssetTokenData(assetTokenData) {

        if(!assetTokenData) {
            return;
        }

        this.assetTokenContract = assetTokenData.assetTokenContract;
        this.assetTokenContractAddress = this.assetTokenContract ? this.assetTokenContract.address : null;
        this.tokenCode = assetTokenData.tokenCode;
        this.totalTokenSupply = assetTokenData.totalTokenSupply;
        this.tradingPeriodDuration = assetTokenData.tradingPeriodDuration;
        this.votingPeriodDuration = assetTokenData.votingPeriodDuration;
        this.approvalDateInSeconds = assetTokenData.approvalDateInSeconds;
        
        this.approvalDate = this.setApprovalDate(assetTokenData.approvalDateInSeconds);
        this.totalTokenSupplyDisplay = convertFromSolidityAndFormatForDisplay(assetTokenData.totalTokenSupply, 0);

        //console.log(`Approval date for ${tokenCode}`, this.approvalDate);

        const listedValueUsd = convertFromSolidityNumber(assetTokenData.totalTokenSupply);
        const priceWhenNew = parseFloat(this.data && this.data.newPrice ? this.data.newPrice : "NaN");

        this.listedValueUsdDisplay = listedValueUsd.toFormat(0);

        if(!isNaN(priceWhenNew)) {
            this.appreciationPercent = listedValueUsd.minus(priceWhenNew).dividedBy(priceWhenNew).multipliedBy(100).decimalPlaces(0);
        }
    }

    setFeeManagerData(feeManagerData) {

        if(!feeManagerData) {
            return;
        }

        this.feeManagerContract = feeManagerData.feeManagerContract;
        this.beeContract = feeManagerData.beeContract;
        this.totalEscrow = feeManagerData.totalEscrow;
        this.totalMSI =  feeManagerData.totalMSI;
        this.totalPAF =  feeManagerData.totalPAF;
        this.totalPTF =  feeManagerData.totalPTF;

        this.escrowPerToken = this.totalEscrow.dividedBy(this.totalTokenSupply);
        this.msiPerToken = this.totalMSI.dividedBy(this.totalTokenSupply);
        this.pafPerToken = this.totalPAF.dividedBy(this.totalTokenSupply);
        this.ptfPerToken = this.totalPTF.dividedBy(this.totalTokenSupply);

        this.escrowRateDisplay = this.escrowPerToken.multipliedBy(100);
        // this.msiRateDisplay = this.msiPerToken.multipliedBy(100) // TODO hook this up if we need to display MSI
        this.pafRateDisplay = this.pafPerToken.multipliedBy(100);
        this.ptfRateDisplay = this.ptfPerToken.multipliedBy(100);
    }

    setAssetRankTrackerData(assetRankTrackerData) {

        if(!assetRankTrackerData) {
            return;
        }

        this.assetRankTracker = assetRankTrackerData;
    }

    setWhitelistData(whitelistData) {

        if(!whitelistData) {
            return;
        }

        this.whitelistContract = whitelistData.whitelistContract;
        this.isWhitelistEnabled = whitelistData.isEnabled;
        this.isWhitelistUsedForInitialPurchases = whitelistData.isUsedForInitialPurchases;
        this.isWhitelistUsedForClaimerTransfers = whitelistData.isUsedForClaimerTransfers;
        this.isWhitelistUsedForP2PTransfers = whitelistData.isUsedForP2PTransfers;
        this.whitelistedCountries = whitelistData.allowedCountries;
    }

    getFeeManagerData() {
        return new FeeManagerData(this.feeManagerContract, this.beeContract, this.totalEscrow, this.totalMSI, this.totalPAF, this.totalPTF);
    }

    getTokenContractData() {
        return new TokenContractData(this.assetTokenContract, this.tokenCode, this.totalTokenSupply, this.tradingPeriodDuration, this.votingPeriodDuration, this.approvalDateInSeconds);
    }

    getWhitelistData() {
        return new WhitelistContractData(this.whitelistContract, this.isWhitelistEnabled, this.isWhitelistUsedForInitialPurchases, this.isWhitelistUsedForClaimerTransfers, this.isWhitelistUsedForP2PTransfers, this.whitelistedCountries);
    }

    getAssetRankTrackerData() {
        return new AssetRankTrackerContractData(this.assetRankTracker.contract, this.assetRankTracker.assetLimits.slice(0));
    }

    clone() {
        return new LoadedAsset(this, this.data, this.tokenBitCarPercent, this.getTokenContractData(), this.getFeeManagerData(), this.getWhitelistData());
    }
}
