import store from '../store';
import moment from 'moment';
import ipfsApi from "ipfs-http-client";
import numeral from 'numeral';
import { setPlatformError, setPlatformWarning } from '../actions';
import BigNumber from 'bignumber.js';
import { isNumber } from 'util';
import axios from 'axios';
import { getMembershipServerError } from './web3/errorMessaging';
import { MEMBERSHIP_RESPONSE } from './globalVariables';
import ErrorWrapper from '../classes/ErrorWrapper';

export const contractAddressLength = 42;

export const emptyAddress = "0x0000000000000000000000000000000000000000";

export function setDocumentTitle(title) {
    document.title = 'BitCar | ' + title;
}

export function scrollToTop() {
    if(!window) {return};
    window.scrollTo(0, 0);
}

export function isDeveloperMode() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function doStringsMatchIgnoringCase(string1, string2) {
    if(string1 === string2) {
        return true;
    }

    if(string1 === undefined || string2 === undefined) {
        return false;
    }

    if(string1 === null || string2 === null) {
        return false;
    }

    return string1.toLowerCase() === string2.toLowerCase();
}

export function doesStringContainIgnoringCase(stringToSearch, searchString) {
    if(stringToSearch === searchString) {
        return true;
    }

    if(stringToSearch === undefined || searchString === undefined) {
        return false;
    }

    return stringToSearch.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
}

export function logToConsoleInDev(message, object) {
    if(!isDeveloperMode()) {
        return false;
    }

    console.log(message, object);
}

export function throwIfUndefined (value, parameterName) 
{ 
    if(value !== undefined) 
    {
        return;
    }

    throw new Error(`Parameter '${parameterName}' is missing or undefined!`);
};

export function trimAddress(fullAddress) {
    if(fullAddress.length != 42) {
        return fullAddress;
    }

    return fullAddress === undefined || fullAddress.length === 0 ? "" : fullAddress.substring(0,6) + "..." + fullAddress.substring(fullAddress.length -6, fullAddress.length);
 }
// export const ipfsUrl = 'https://gateway.ipfs.io/ipfs/';
export const ipfsUrl = `${process.env.REACT_APP_IPFS_READ_BASE_URL}/ipfs/`;
export const KYC_API_URL = `${process.env.REACT_APP_KYC_API_READ_BASE_URL}`;

export const ipfsApiConnection = new ipfsApi({ host: process.env.REACT_APP_IPFS_API_HOST, port: parseInt(process.env.REACT_APP_IPFS_API_PORT), protocol: process.env.REACT_APP_IPFS_API_PROTOCOL });

export function convertFromSolidityAndFormatForDisplay(bigNumber, decimals) {

    if(!bigNumber || !BigNumber.isBigNumber(bigNumber)) {
        throw new Error("convertFromSolidityAndFormatForDisplay expects a BigNumber object for parameter 'bigNumber'");
    } else if(isNaN(decimals)) {
        throw new Error("convertFromSolidityAndFormatForDisplay expects a numerical value for parameter 'decimals'");
    } else if(bigNumber.isNaN()) {
        return bigNumber.toString();
    }

    return convertFromSolidityNumber(bigNumber).toFormat(decimals);
}

export function getNumeralFormat(decimalPlaces) {
    let decimalFormat = '';
    for (let i=0; i<decimalPlaces; i++) { decimalFormat += '0' };
    return decimalFormat;
}

export function convertToSolidityNumber(value) {
    
    if(!value || !BigNumber.isBigNumber(value)) {
        throw new Error("convertToSolidityNumber expects a BigNumber object for parameter 'value'");
    }

    if(value.isNaN()) {
        return value;
    }

    // div 1 enforces our rounding and decimal rules
    return value.shiftedBy(8).decimalPlaces(0, BigNumber.ROUND_UP);
}

export function convertFromSolidityNumber(value) {

    if(!value || !BigNumber.isBigNumber(value)) {
        throw new Error("convertFromSolidityNumber expects a BigNumber object for parameter 'value'");
    }

    if(value.isNaN()) {
        return value;
    }

    return value.shiftedBy(-8);
}

export function isValidSolidityNumber(value) {
    if(isNaN(parseFloat(value))) {
        return 0;
    }

    return value < Math.pow(2, 256-1);
}

export function asyncSleep(sleepTimeMs) {new Promise(resolve => setTimeout(resolve, sleepTimeMs));};

export function syncSleep(sleepTimeMs) {
    var start = Date.now(),
        now = start;
    while (now - start < sleepTimeMs) {
      now = Date.now();
    }
}

export function getDateDifferenceString(approvalDate, tradingEndDate) {
    var endDate = moment(tradingEndDate);
    var startDate = moment(approvalDate);

    var years = endDate.diff(startDate, 'year');
    startDate.add(years, 'years');

    var months = endDate.diff(startDate, 'months');
    startDate.add(months, 'months');

    var days = endDate.diff(startDate, 'days');

    return `${years ? `${years} Year${addS(years)}` : ""} ${months ? `${months} Month${addS(months)}` : ""} ${days ? `${days} Day${addS(days)}` : ""}`;
}

function addS(value) {
    return value > 1 ? "s" : "";
}

export function secondsToYears(seconds) {
    return (seconds > 0 ? Math.round(seconds / 31557600) : 0);
}

export function secondsToYearsString(seconds) {
    return secondsToYears(seconds) + ' years';
}

export function yearsToSeconds (years) {
    return daysToSeconds(years * 365);
}

export function daysToSeconds (days) {
    return days * 86400;
}

export function minsToSeconds (minutes) {
    return minutes * 60;
}

export function bitcarToUSD(bitcarValue, bitcarUSD) {
    if(!bitcarValue || !BigNumber.isBigNumber(bitcarValue)) {
        throw new Error("bitcarToUSD expects a BigNumber object for parameter 'bitcarValue'");
    } else if(!bitcarUSD || !BigNumber.isBigNumber(bitcarUSD)) {
        throw new Error("bitcarToUSD expects a BigNumber object for parameter 'bitcarUSD'");
    }

    return bitcarValue.multipliedBy(bitcarUSD);
}

export function USDtoBitcar(USDValue, bitcarUSD) {
    if(!USDValue || !BigNumber.isBigNumber(USDValue)) {
        throw new Error("USDtoBitcar expects a BigNumber object for parameter 'USDValue'");
    } else if(!bitcarUSD || !BigNumber.isBigNumber(bitcarUSD)) {
        throw new Error("USDtoBitcar expects a BigNumber object for parameter 'bitcarUSD'");
    }

    const reverseRate = new BigNumber(1).dividedBy(bitcarUSD);
    return reverseRate.multipliedBy(USDValue);
}

export function USDtoETH(USDValue, ethUSD) {
    if(!USDValue || !BigNumber.isBigNumber(USDValue)) {
        throw new Error("USDtoETH expects a BigNumber object for parameter 'USDValue'");
    } else if(!ethUSD || !BigNumber.isBigNumber(ethUSD)) {
        throw new Error("USDtoETH expects a BigNumber object for parameter 'ethUSD'");
    }

    const reverseRate = new BigNumber(1).dividedBy(ethUSD);
    return reverseRate.multipliedBy(USDValue);
}

export function ETHtoUSD(ethValue, ethUSD) {
    if(!ethValue || !BigNumber.isBigNumber(ethValue)) {
        throw new Error("ETHtoUSD expects a BigNumber object for parameter 'ethValue'");
    } else if(!ethUSD || !BigNumber.isBigNumber(ethUSD)) {
        throw new Error("ETHtoUSD expects a BigNumber object for parameter 'ethUSD'");
    }

    return ethValue.multipliedBy(ethUSD);
}

export function platformError(wrappedError) {
    store.dispatch(setPlatformError(wrappedError));
}

export function platformWarning(wrappedError) {
    store.dispatch(setPlatformWarning(wrappedError));
}

export function isBigNumberEqual(number1, number2) {
    if(number1 === number2) {
        return true;
    }

    if(number1 === undefined || number2 === undefined) {
        return false;
    }

    if(number1 === null || number2 === null) {
        return false;
    }

    if(number1 instanceof BigNumber && number2 instanceof BigNumber) {
        if(number1.isNaN() && number2.isNaN()) {
            return true;
        }
    
        return number1.isEqualTo(number2);
    }

    if(number1 === NaN && number2 === NaN) {
        return true;
    }

    return false;
}

export async function checkAccessCriteria(isMembershipRequest) {
    return new Promise((resolve, reject) => {

        const config = {
            validateStatus: isMembershipRequest ? validateMembershipServerResponse : validatePurchaseServerResponse
        };

        axios.get(process.env.REACT_APP_KYC_API_READ_BASE_URL, config)
            .then(response => resolve({result: true, statusCode: response.status}))
            .catch(error => {

                const statusCode = error.response && error.response.status ? error.response.status : 0;

                // if not a membership request, we have to avoid platform going down
                if(!isMembershipRequest && statusCode !== MEMBERSHIP_RESPONSE.restricted) {
                    resolve({result: true, statusCode: statusCode});
                    return;
                }

                const errorWrapper = getMembershipServerError(statusCode, isMembershipRequest);

                resolve({result: false, statusCode: statusCode, error: errorWrapper});
            });
    });
}

function validateMembershipServerResponse (status) {
    console.log('member server status', status);
    // console.log('validating', status);
    // console.log('is req valid?', (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid);
    // standard responses, but allow invalid headers as just testing for geo and server state 
    return (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid;
}

function validatePurchaseServerResponse (status) {
    console.log('server status', status);
    // console.log('validating', status);
    // console.log('is req valid?', (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid);
    // standard responses, but allow invalid headers as just testing for geo and server state 
    return (status >= 200 && status < 300) || status !== MEMBERSHIP_RESPONSE.restricted;
}