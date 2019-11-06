import BigNumber from "bignumber.js";

export default class TokenContractData {

    assetTokenContract;
    tokenCode;
    totalTokenSupply;
    tradingPeriodDuration;
    votingPeriodDuration;
    approvalDateInSeconds;

    constructor(assetTokenContract, tokenCode, totalTokenSupply, tradingPeriodDuration, votingPeriodDuration, approvalDateInSeconds) {
        this.assetTokenContract = assetTokenContract;
        this.tokenCode = tokenCode;
        this.totalTokenSupply = new BigNumber(totalTokenSupply);
        this.tradingPeriodDuration = parseFloat(tradingPeriodDuration);
        this.votingPeriodDuration = parseFloat(votingPeriodDuration);
        this.approvalDateInSeconds = parseFloat(approvalDateInSeconds);
    }
}