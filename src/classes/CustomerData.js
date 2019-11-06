export class CustomerData {

    hotWallet;
    status;
    region;
    membership;
    coldWallet;
    count;

    constructor(hotWallet, status, region, membership, coldWallet, count) {
        this.hotWallet = hotWallet;
        this.status = status;
        this.region = region;
        this.membership = membership;
        this.coldWallet = coldWallet;
        this.count = count;
    }
}