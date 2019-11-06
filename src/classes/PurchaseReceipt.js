import BigNumber from "bignumber.js";
import { convertToSolidityNumber, convertFromSolidityNumber } from "../util/helpers";

export default class PurchaseReceipt {

    boughtAssetEventResponse;
    loadedAsset;
    returnValues;
    transactionHash;

    msiCost;    // Maintenance, Storage and Insurance
    pafCost;    // Platform Access Fee
    beeCost;    // Bitcar Extension Escrow
    ptfCost;    // Platform Transaction Fee
    tokenCostBitcar;
    weiCost;
    totalBitcarSpent;

    exRateEthUSD = new BigNumber(0);
    exRateBitCarUSD;

    user;

    constructor(web3, boughtAssetEventResponse, loadedAsset, transactionTime) {
        this.boughtAssetEventResponse = boughtAssetEventResponse;
        this.transactionTime = transactionTime;
        this.loadedAsset = loadedAsset;
        this.transactionHash = boughtAssetEventResponse.transactionHash;

        const eventValues = boughtAssetEventResponse.returnValues;

        this.beeCost = new BigNumber(eventValues.beeCost);
        this.msiCost = new BigNumber(eventValues.msiCost);
        this.pafCost = new BigNumber(eventValues.pafCost);
        this.ptfCost = new BigNumber(eventValues.ptfCost);
        this.tokenCostBitcar = new BigNumber(eventValues.tokenCostBitcar);
        this.tokenAmount = new BigNumber(eventValues.tokenAmount);
        this.totalBitcarSpent = this.tokenCostBitcar.plus(this.beeCost).plus(this.msiCost).plus(this.pafCost).plus(this.ptfCost);
        
        this.ethCost = web3 ? new BigNumber(web3.utils.fromWei(eventValues.costWei.toString(), 'ether')) : new BigNumber(0);

        let usdEth = new BigNumber(0);
        
        if(loadedAsset.requiresEth) {
            usdEth = new BigNumber(1).dividedBy(new BigNumber(convertToSolidityNumber(this.ethCost)).dividedBy(this.tokenAmount.multipliedBy(loadedAsset.tokenEthereumPercent)));
        }

        this.exRateEthUSD = usdEth;
        this.exRateBitCarUSD = new BigNumber(1).dividedBy(this.tokenCostBitcar.dividedBy(this.tokenAmount.multipliedBy(loadedAsset.tokenBitCarPercent)));

        this.user = eventValues.user;

        this.totalUsd = convertFromSolidityNumber(this.totalBitcarSpent).multipliedBy(this.exRateBitCarUSD).plus(convertFromSolidityNumber(this.tokenAmount).multipliedBy(loadedAsset.tokenEthereumPercent));
    }
}
