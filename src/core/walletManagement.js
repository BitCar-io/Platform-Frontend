import store from '../store';
import { setLocalPortfolioWallets } from '../actions';
import { doStringsMatchIgnoringCase, contractAddressLength } from '../util/helpers';
import * as _ from 'lodash';
import { WalletData } from '../classes/WalletData';

const LocalStorageWalletKey="WalletsForPortfolio";

export const getLocalWalletData = (user) => {
    const unsavedWalletText = "(Not in Address book)"

    let walletDataArray = [];

    if(!localStorage) {
        if(user && user.coinbase) {
            walletDataArray.push(new WalletData(user.coinbase, unsavedWalletText, defaultWallet === undefined, false));
        }
        if(user && user.coldWallet) {
            walletDataArray.push(new WalletData(user.coldWallet, unsavedWalletText, defaultWallet === undefined, false));
        }
        return walletDataArray;
    }

    const walletsForPortfolio = localStorage.getItem(LocalStorageWalletKey);

    if(walletsForPortfolio) {
         const rawWalletData = JSON.parse(walletsForPortfolio);
         walletDataArray = rawWalletData.map(wallet => {
            return new WalletData(wallet.address, wallet.description, wallet.isDefault, true);
         });
    }

    if(user) {
        const storageWallet = walletDataArray.find(wallet => doStringsMatchIgnoringCase(wallet.address, user.coldWallet));
        if(storageWallet) {
            storageWallet.isStorageAddress = true;
        }
    }

    const localWallets = [...walletDataArray];

    const defaultWallet = walletDataArray.find(wallet => wallet.isDefault === true);
    if(user) {
        if(user.coinbase && !walletAddressIsInAddressBook(walletDataArray, user.coinbase)) {
            walletDataArray.push(new WalletData(user.coinbase, unsavedWalletText, defaultWallet === undefined, false));
        }

        if(user.coldWallet && !walletAddressIsInAddressBook(walletDataArray, user.coldWallet)) {
            walletDataArray.push(new WalletData(user.coldWallet, unsavedWalletText, defaultWallet === undefined, false, true));
        }
    }

    return {wallets: walletDataArray.sort(walletSort), localWallets: localWallets.sort(walletSort), defaultWallet: defaultWallet ? defaultWallet : walletDataArray ? walletDataArray[0] : undefined};
}

export const walletAddressIsInAddressBook = (walletDataArray, coinbase) => {
    if(!walletDataArray || !coinbase) {
        return false;
    }

    const existingWallet = walletDataArray.find(wallet => wallet.isStoredLocally && doStringsMatchIgnoringCase(wallet.address, coinbase));
    return existingWallet !== undefined;
}

export const isValidWalletAddress = (web3, address, validatorCallback) => {
    if (address === undefined || address.trim().length === 0) {

        if(validatorCallback) {
            validatorCallback();
        }
        return false;
    }

    const addressValue = address.trim();

    if (addressValue.length !== contractAddressLength) {
        if(validatorCallback) {
            validatorCallback(`Ethereum wallet address should be ${contractAddressLength} characters`);
        }
        return false;
    }

    if(!web3.utils.isAddress(addressValue)) {
        if(validatorCallback) {
            validatorCallback("Invalid Ethereum Address - please check and try again.");
        }
        return false;
    }

    return true;
}

export const saveLocalWalletData = (walletDataArray, user) => {
    if(localStorage) {
        localStorage.setItem(LocalStorageWalletKey, JSON.stringify(walletDataArray));
    }

    store.dispatch(setLocalPortfolioWallets(getLocalWalletData(user)));
}

const walletSort = (x, y) => {
    return (x.isDefault === y.isDefault) ? 0 : x.isDefault ? -1 : 1;
}