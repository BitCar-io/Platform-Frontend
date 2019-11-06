import { doStringsMatchIgnoringCase, trimAddress } from '../util/helpers';

export class WalletData {

    address;
    description;
    displayAddress;
    isDefault;
    isStoredLocally;
    isStorageAddress;
    key;

    constructor(address, description, isDefault, isStoredLocally, isStorageAddress) {
        this.address = address;
        this.description = description;
        this.key = address;
        this.isDefault = isDefault;
        this.displayAddress = trimAddress(address);
        this.isStoredLocally = isStoredLocally;
        this.isStorageAddress = isStorageAddress === true ? true : false;
    }

    isCurrent(coinbase) {
        return doStringsMatchIgnoringCase(this.address, coinbase);
    }
}