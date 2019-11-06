import React from "react";
import { RANK_LEVELS } from "../../core/rankTracking";
import store from '../../store';
import { MEMBERSHIP_RESPONSE } from "../globalVariables";
import ErrorWrapper from "../../classes/ErrorWrapper";
import { Link } from "react-router-dom";
import { URL_TERMS_AND_CONDITIONS } from "../platformNavigation";

export const UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

// Web3 Errors
const NONCE_ERROR = "NONCE_ERROR";
const USER_REJECT = "USER_REJECT";
const NETWORK_CONNECTION = "NETWORK_CONNECTION";
export const RECEIPT_NOERROR_STATUS_FALSE = "RECEIPT_NOERROR_STATUS_FALSE";

// Platform Blockchain Errors
export const BUY_TOKENS_ASSET_NOT_LIVE = "BUY_TOKENS_ASSET_NOT_LIVE";   // also used for EPOCH time to go live
export const BUY_TOKENS_ETHEREUM_LOW = "BUY_TOKENS_ETHEREUM_LOW";
export const BUY_TOKENS_BITCAR_LOW = "BUY_TOKENS_BITCAR_LOW";
export const BUY_TOKENS_PLATFORM_MEMBERSHIP_LIMIT_REACHED = "BUY_TOKENS_PLATFORM_MEMBERSHIP_LIMIT_REACHED";
export const BUY_TOKENS_ASSET_MEMBERSHIP_LIMIT_REACHED = "BUY_TOKENS_ASSET_MEMBERSHIP_LIMIT_REACHED";
export const BUY_TOKENS_USER_PERIOD_LIMIT_REACHED = "BUY_TOKENS_USER_PERIOD_LIMIT_REACHED";
export const BUY_TOKENS_ASSET_BALANCE_LOW = "BUY_TOKENS_ASSET_BALANCE_LOW";
export const BUY_TOKENS_QTY_TOO_LOW = "BUY_TOKENS_QTY_TOO_LOW";
const BUY_TOKENS_USER_NOT_REGISTERED = "BUY_TOKENS_USER_NOT_REGISTERED";
const WHITELIST_INVALID = "WHITELIST_INVALID";
export const WHITELIST_BUY_INVALID = "WHITELIST_BUY_INVALID";
const WHITELIST_CLAIM_INVALID = "WHITELIST_CLAIM_INVALID";

export const MEMBERSHIP_INVALID_HEADERS = "MEMBERSHIP_INVALID_HEADERS";
export const MEMBERSHIP_LOCATION_FAILURE = "MEMBERSHIP_LOCATION_FAILURE";
export const MEMBERSHIP_NETWORK_FAILURE = "MEMBERSHIP_NETWORK_FAILURE";
export const MEMBERSHIP_FAILURE = "MEMBERSHIP_FAILURE";
export const MEMBERSHIP_DUPLICATION = "MEMBERSHIP_DUPLICATION";
export const BUY_TOKENS_LOCATION_FAILURE = "BUY_TOKENS_LOCATION_FAILURE";
export const LOCATION_NETWORK_FAILURE = "LOCATION_NETWORK_FAILURE";
export const LOCATION_FAILURE = "LOCATION_FAILURE";

// Unexpected Errors (we have error handling to prevent the user hitting these)
const BUY_TOKENS_BITCAR_BEE = "BUY_TOKENS_BITCAR_BEE";
const BUY_TOKENS_BITCAR_PAF = "BUY_TOKENS_BITCAR_PAF";
const BUY_TOKENS_BITCAR_MSI = "BUY_TOKENS_BITCAR_MSI";
const BUY_TOKENS_BITCAR_TRANSFER = "BUY_TOKENS_BITCAR_TRANSFER";
const BUY_TOKENS_CONDITIONS = "BUY_TOKENS_CONDITIONS";
const BUY_TOKENS_TOKEN_TRANSFER = "BUY_TOKENS_TOKEN_TRANSFER";

// Platform Errors/Warnings
export const ETHEREUM_NETWORK_FAILURE = "ETHEREUM_NETWORK_FAILURE";
export const CONTRACT_LOAD_FAILURE = "CONTRACT_LOAD_FAILURE";
export const TICKER_WARNING_NO_RETRY = "TICKER_WARNING_NO_RETRY";
export const TICKER_WARNING_WITH_RETRY = "TICKER_WARNING_WITH_RETRY";
export const ASSET_LOAD_FAILURE = "ASSET_LOAD_FAILURE";


export const WEB3_ERRORS = {
    "MetaMask is having trouble connecting to the network": NETWORK_CONNECTION,
    "the tx doesn't have the correct nonce": NONCE_ERROR,
    "User denied transaction": USER_REJECT,
    "User denied message": USER_REJECT
}

export const PLATFORM_ERRORS = {
    "Purchases are not allowed": BUY_TOKENS_ASSET_NOT_LIVE,
    "Purchase time has not been reached": BUY_TOKENS_ASSET_NOT_LIVE,
    "Conditions to buy tokens not met": BUY_TOKENS_CONDITIONS,
    "Not enough ETH was sent to cover this asset's cost": BUY_TOKENS_ETHEREUM_LOW,
    "Unsuccessful BitCar tokens transaction from User to Agent": BUY_TOKENS_BITCAR_TRANSFER,
    "Unsuccessful Asset tokens transaction from Asset to User": BUY_TOKENS_TOKEN_TRANSFER,
    "Failed to transfer BitCar tokens to BEE": BUY_TOKENS_BITCAR_BEE,
    "Failed to transfer BitCar tokens to PAF": BUY_TOKENS_BITCAR_PAF,
    "Failed to transfer BitCar tokens to MSI": BUY_TOKENS_BITCAR_MSI,
    "P2P transfer check is enabled and from or to is not whitelisted": WHITELIST_INVALID,
    "Initial purchases check is enabled and user is not whitelisted": WHITELIST_BUY_INVALID,
    "Claimer transfer check is enabled and user is not whitelisted": WHITELIST_CLAIM_INVALID
}

export let FRIENDLY_ERROR_MESSAGES = {
    // General Platform Errors
    ETHEREUM_NETWORK_FAILURE: {title: "Failed to load BitCar Platform", message: "The platform was unable to connect to an ethereum network, please check your internet connectivity and try again."},
    BUY_TOKENS_USER_NOT_REGISTERED: {title: "You do not seem to be registered as a member?", message: "BitCar requires you to be a registered user on the platform, before you can purchase any fractions of a car."},
    CONTRACT_LOAD_FAILURE: {title: "Failed to load one or more platform-critical contracts from the Blockchain", message: "The platform was unable to load required data from the blockchain, please check your internet connection and try again."},
    ASSET_LOAD_FAILURE: {title: "Failed to load car data", message: "The platform was unable to load required data for displaying the cars, please check your internet connection and try again."},
    MEMBERSHIP_NETWORK_FAILURE: {title: "Network Error", message: "There seems to have been a network error whilst attempting to communicate with the membership server - please check your internet connection and try again."},
    LOCATION_NETWORK_FAILURE: {title: "Network Error", message: "There seems to have been a network error whilst attempting to verify your location - please check your internet connection and try again."},
    MEMBERSHIP_INVALID_HEADERS: {title: "Validation Failed", message: "There seems to have been an issue validating your request, please try again, or contact BitCar for support."},
    MEMBERSHIP_LOCATION_FAILURE: {title: "Registration is Not Permitted", message: "It seems that you are trying to register onto the BitCar platform from an unsupported location (please refer to section 4 of the Terms and Conditions)"},
    MEMBERSHIP_DUPLICATION: {title: "Already Received or Validation Error", message: "You seem to have already submitted this membership request, or something has gone wrong during the validation process; please try again later or contact BitCar for support."},

    // Infrastructure Errors
    MEMBERSHIP_FAILURE: {title: "Request Failed", message: "Our membership registration process seems to be experiencing difficulties at this time; please try again later or contact BitCar for support."},
    LOCATION_FAILURE: {title: "Request Failed", message: "We seem to be experiencing difficulties verifiying your location (please refer to section 4 of the Terms and Conditions); please try again later or contact BitCar for support."},

    // Platform Warnings
    TICKER_WARNING_NO_RETRY: {title:"Could not connect to BitCar and Ethereum currency feed - this will prevent purchases and currency display.", message:"The platform was unable to load the contract from the blockchain required to provide the live currency feed at this time.<br />Please check your internet connectivity, try reloading and refer to the <a href='https://bitcar.io' target='_blank'>bitcar.io</a> website for any outage information.<br />This will prevent any price information from being displayed and purchases being made."},
    TICKER_WARNING_WITH_RETRY: {title:"Could not connect to BitCar and Ethereum currency feed - this will prevent purchases and currency display.", message:"The platform was unable to connect to the live currency ticker at this time.<br />Please check your internet connectivity, try reloading and refer to the <a href='https://bitcar.io' target='_blank'>bitcar.io</a> website for any outage information.<br />This will prevent any price information from being displayed and purchases being made.<br />The site should automatically reconnect if the feed becomes available."},
    
    // Blockchain platform errors
    WHITELIST_BUY_INVALID: {title: "Not Permitted to Buy", message: "You are not currently allowed to purchase this car due to your country of residence (supplied on your membership application form). Please contact BitCar if you believe this to be an error."},
    WHITELIST_CLAIM_INVALID: {title: "Not Permitted to Claim", message: "You are not currently allowed to claim due to your country of residence (supplied on your membership application form). Please contact BitCar if you believe this to be an error."},
    BUY_TOKENS_ASSET_BALANCE_LOW: {title: "Not Enough Fractions Remaining", message: "You are trying to purchase more fractions than are remaining for this car on the platform, please adjust the purchase amount and try again."},
    BUY_TOKENS_ASSET_NOT_LIVE: {title: "Car not available for purchase", message: "This car is not yet available for purchase, please check the launch date and try again."},
    BUY_TOKENS_BITCAR_LOW: {title: "BitCar Balance too low", message: "Your current BitCar balance is too low to make this purchase, please buy more from one of the exchanges (links at the bottom of the page), or transfer to this wallet."},
    BUY_TOKENS_ETHEREUM_LOW: {title: "Ethereum Balance too low", message: "Your current Ethereum balance is too low to make this purchase, please buy more from an exchange, or transfer to this wallet."},
    BUY_TOKENS_QTY_TOO_LOW: {title: "Minimum purchase not met", message: "Amount requested is below the required minimum purchase level for this car, please adjust the quantity and try again."},
    BUY_TOKENS_PLATFORM_MEMBERSHIP_LIMIT_REACHED: {title: "Platform Membership Limit", message: "This purchase is not possible, as your purchase limit would be exceeded."},
    BUY_TOKENS_ASSET_MEMBERSHIP_LIMIT_REACHED: {title: "Platform Car Purchase Limit", message: "This purchase is not possible, as your purchase limit would be exceeded."},
    BUY_TOKENS_USER_PERIOD_LIMIT_REACHED: {title: "Personal Car Purchase Limit", message: "This purchase is not possible, as your purchase limit would be exceeded."},
    BUY_TOKENS_LOCATION_FAILURE: {title: "Not Permitted to Purchase", message: <React.Fragment>It seems that you are trying to purchase from an unsupported location (please refer to section 4 of the <Link to={URL_TERMS_AND_CONDITIONS} target="_blank">Terms and Conditions of use</Link>).</React.Fragment>},


    // web3 errors
    NETWORK_CONNECTION: {title: "Network Error", message: "The platform is having trouble communicating with the Ethereum network - please check MetaMask or your other provider and try again."},
    NONCE_ERROR: {title: "NONCE_ERROR", message: "There seems to be an error with your wallet provider, please try...?"},
    USER_REJECT: {title: "USER_REJECT", message: "You have rejected a confirmation to privately sign or confirm this transaction so no BitCar or Ethereum has been spent from your wallet. Please try again and confirm all transactions to continue."},
    UNEXPECTED_ERROR: {title: "Unexpected Error", message: "An unexpected error has occured, please try again or contact BitCar support for assistance."},
    RECEIPT_NOERROR_STATUS_FALSE: {title: "Unexpected Error", message: "The platform received an unexpected response from the blockchain, please check your transaction in MetaMask to see if it has been confirmed or rejected."}
}

function getPlatformMembershipLimitMessage () {
    
    const currentUserRank = getCurrentUserRank();

    if(!currentUserRank) {
        return FRIENDLY_ERROR_MESSAGES.BUY_TOKENS_USER_NOT_REGISTERED;
    }

    const rankText = RANK_LEVELS[currentUserRank];
    const platformLimit = 'TODO';
    return {title: `Platform limit reached for ${rankText} Membership`, message: `Purchase can not continue as it will cause you to go over your all-time platform limit as a ${rankText} member, which is currently ${platformLimit} fractions of cars.`};
}

function getCurrentUserRank () {
    const currentUser = store.getState().UIstate.currentUser;
    return currentUser ? currentUser.rank : null;
}

export function getMembershipServerErrorMessage(status) {

    // by default handle any unexpected codes
    let userMessage = 'Our membership registration process seems to be experiencing difficulties at this time; please try again later or contact BitCar for support.';

    if(status === 0) {
        userMessage = 'There seems to have been a network error whilst attempting to communicate with the membership server - please check your internet connection and try again.';
    }

    // Occurs when transmitted headers are invalid
    if(status === MEMBERSHIP_RESPONSE.invalid) {
        userMessage = 'There seems to have been an issue validating your request, please try again, or contact BitCar for support.';
    }
    
    // Occurs when geoblocking has occurred
    if(status === MEMBERSHIP_RESPONSE.restricted) {
        userMessage = 'It seems that you are trying to register onto the BitCar platform from an unsupported location (please refer to section 4 of the Terms and Conditions) - registration is not permitted.'
    }
    
    // Occurs when request has been sent already
    if(status === MEMBERSHIP_RESPONSE.alreadySubmitted) {
        userMessage = 'You seem to have already submitted this membership request, or something has gone wrong during the validation process; please try again later or contact BitCar for support.';
    }

    return userMessage;
}

export function getMembershipServerError(serverStatusCode, isMembershipRequest) {

    let errorCode = isMembershipRequest ? MEMBERSHIP_FAILURE : LOCATION_FAILURE;

    if(serverStatusCode === 0) {
        errorCode = isMembershipRequest ? MEMBERSHIP_NETWORK_FAILURE : LOCATION_NETWORK_FAILURE;
    }

    // Occurs when transmitted headers are invalid
    if(serverStatusCode === MEMBERSHIP_RESPONSE.invalid) {
        errorCode = isMembershipRequest ? MEMBERSHIP_INVALID_HEADERS : errorCode;
    }
    
    // Occurs when geoblocking has occurred
    if(serverStatusCode === MEMBERSHIP_RESPONSE.restricted) {
        errorCode = isMembershipRequest ? MEMBERSHIP_LOCATION_FAILURE : BUY_TOKENS_LOCATION_FAILURE;
    }
    
    // Occurs when request has been sent already
    if(serverStatusCode === MEMBERSHIP_RESPONSE.alreadySubmitted) {
        errorCode = isMembershipRequest ? MEMBERSHIP_DUPLICATION : errorCode;
    }

    return new ErrorWrapper(errorCode);
}

// const getAssetMemberLimitReachedMessage = (asset) => {

//     const currentUserRank = getCurrentUserRank();

//     if(!currentUserRank) {
//         return FRIENDLY_ERROR_MESSAGES[BUY_TOKENS_USER_NOT_REGISTERED];
//     }

//     const assetRankLimits = asset.assetRank.assetRankTracker.assetlimits[currentUserRank];
    
//     return {title: `Purchase limit reached for ${rankText} Membership`, message: `Purchase can not continue as it will cause you to go over your purchase limit for this car as a ${rankText} member, which is currently ${assetRankLimits.} fractions of cars.`};
// }

// const getUserAssetMemberLimitReachedMessage = (asset) => {

//     const currentUserRank = getCurrentUserRank();

//     if(!currentUserRank) {
//         return FRIENDLY_ERROR_MESSAGES[BUY_TOKENS_USER_NOT_REGISTERED];
//     }

//     const assetRankLimits = asset.assetRank.assetRankTracker.assetlimits[currentUserRank];
    
//     return {title: `Purchase limit reached for ${rankText} Membership`, message: `Purchase can not continue as the platform limit for this car for all ${rankText} member, which is currently ${assetRankLimits.} fractions of cars.`};
// }
