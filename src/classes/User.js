import { doStringsMatchIgnoringCase } from '../util/helpers';
import { RANK_LEVELS } from '../core/rankTracking'
import { CustomerData } from './CustomerData';
export class User {

    isTrader = false;
    isAgent = false;
    isAdmin = false;
    isSudo = false;
    coinbase = undefined;
    rank = undefined;
    rankText = undefined;

    canAccessUnapprovedAssets = false;

    // customer data
    status;
    region;
    membership;
    hotWallet;
    coldWallet;
    count;

    isConnectedWithColdWallet;

    constructor(coinbase, isTrader, isAgent, isAdmin, isSudo, rank, customerData) {
        this.coinbase = coinbase;
        this.isTrader = isTrader;
        this.isAgent = isAgent;
        this.isAdmin = isAdmin;
        this.isSudo = isSudo;
        this.setRank(rank);
        this.setCustomerData(customerData);

        this.canAccessUnapprovedAssets = isAgent || isAdmin || isSudo;
    }

    canAccessAsset = asset => {
        return asset.isLive || this.isAdmin || this.isSudo || (this.isAgent && doStringsMatchIgnoringCase(this.coinbase, asset.agent));
    }

    setCustomerData(customerData) {
        if(!customerData) {
            return;
        }

        this.status = customerData.status;
        this.region = customerData.region;
        this.membership = customerData.membership;
        this.hotWallet = customerData.hotWallet;
        this.coldWallet = customerData.coldWallet;
        this.count = customerData.count;

        this.isConnectedWithColdWallet = this.coldWallet === this.coinbase;
    }

    getCustomerData() {
        return this.status ? new CustomerData(this.hotWallet, this.status, this.region, this.membership, this.coldWallet, this.count) : undefined;
    }

    setRank(rank) {

        if (this.isTrader && rank && rank >= 0 && RANK_LEVELS.length > rank) {
            this.rankText = RANK_LEVELS[rank];
            this.rank = rank;
        } else {
            this.rankText = null;
            this.rank = null;
        }
    }
}