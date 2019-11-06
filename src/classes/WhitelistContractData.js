export default class WhitelistContractData {

    whitelistContract;
    isEnabled;
    isUsedForInitialPurchases;
    isUsedForClaimerTransfers;
    isUsedForP2PTransfers;
    allowedCountries;

    constructor(whitelistContract, isEnabled, isUsedForInitialPurchases, isUsedForClaimerTransfers, isUsedForP2PTransfers, allowedCountries) {
        this.whitelistContract = whitelistContract;
        this.isEnabled = isEnabled;
        this.isUsedForInitialPurchases = isUsedForInitialPurchases;
        this.isUsedForClaimerTransfers = isUsedForClaimerTransfers;
        this.isUsedForP2PTransfers = isUsedForP2PTransfers;
        this.allowedCountries = allowedCountries;
    }
}