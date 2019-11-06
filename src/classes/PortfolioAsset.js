import LoadedAsset from "./LoadedAsset";
import { convertFromSolidityNumber, convertFromSolidityAndFormatForDisplay } from '../util/helpers';
import BigNumber from "bignumber.js";

export class PortfolioAsset extends LoadedAsset {

    totalUserBalance;
    userTokenBalance;
    displayTotalUserBalance;
    userBalanceValueUsd;
    userPercentOwned;
    userEscrow;
    userPAF;
    userPTF;
    userEscrowDisplay;
    userPAFDisplay;
    userPTFDisplay;

    constructor(loadedAsset, userTokenBalance, assetEscrowBalance, qtySold) {
        super(loadedAsset,loadedAsset.data, loadedAsset.tokenBitCarPercent,
            loadedAsset.getTokenContractData(),
            loadedAsset.getFeeManagerData(),
            loadedAsset.getWhitelistData(),
            loadedAsset.getAssetRankTrackerData());

        this.totalUserBalance = userTokenBalance.totalBalance;
        this.userTokenBalance = userTokenBalance;

        //console.log(`Portfolio asset approval date in seconds ${loadedAsset.approvalDateInSeconds} = ${loadedAsset.approvalDate}`);

        this.displayTotalUserBalance = convertFromSolidityAndFormatForDisplay(this.totalUserBalance, 0);
        this.userPercentOwned = this.totalUserBalance.dividedBy(loadedAsset.totalTokenSupply).multipliedBy(100).toFormat(2);
        this.userBalanceValueUsd = convertFromSolidityNumber(this.totalUserBalance);

        this.userEscrow = qtySold.isEqualTo(0) ? new BigNumber(0) : convertFromSolidityNumber(assetEscrowBalance.dividedBy(qtySold).multipliedBy(this.totalUserBalance));
        this.userPAF = loadedAsset.pafPerToken.multipliedBy(this.totalUserBalance);
        this.userPTF = loadedAsset.ptfPerToken.multipliedBy(this.totalUserBalance);
        this.userEscrowDisplay = qtySold.isEqualTo(0) ? 'Unable to retrieve, please try again.' : this.userEscrow.toFormat(2);
        this.userPAFDisplay = this.userPAF.toFormat(2);
        this.userPTFDisplay = this.userPTF.toFormat(2);
    }
}