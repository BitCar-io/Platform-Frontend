import store from '../store';
import { getOrLoadPlatformContract } from '../util/web3/contracts';
import { convertFromSolidityNumber, convertToSolidityNumber, bitcarToUSD, platformWarning, platformError, logToConsoleInDev,  } from '../util/helpers';
import { BlockchainEvent, startPlatformEvent, PLATFORM_EVENT_TICKER_RATECHANGE } from "../util/web3/eventHelper";
import { setEthereumTickers, tickerIsInitialised } from '../actions';
import { callEthereumMethod } from '../util/web3/web3Wrapper';
import ErrorWrapper from '../classes/ErrorWrapper';
import { TICKER_WARNING_NO_RETRY, TICKER_WARNING_WITH_RETRY } from '../util/web3/errorMessaging';
import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS_USD } from '../util/globalVariables';

const getNumberToDisplay = (value) => {
    return convertFromSolidityNumber(convertToSolidityNumber(value));
}

const tickerInvalidRequireNumber = "3963877391197344453575983046348115674221700746820753546331534351508065746944";

const setBitCarPricing = async (ticker) => {

    if(!ticker) {
        platformWarning(new ErrorWrapper(TICKER_WARNING_NO_RETRY));
        return;
    }

    let hasErrored = false;

    const bitcarUsdPrice = await callEthereumMethod(ticker.methods.getUSD()).catch(error => {
        console.error("Failed to retrieve BITCAR/USD Price", error);
        hasErrored = true;
    });

    const ethUsdPrice = await callEthereumMethod(ticker.methods.getETH()).catch(error => {
        console.error("Failed to retrieve ETH/USD Price", error);
        hasErrored = true;
    });

    // console.log('bitcarUsdPrice', bitcarUsdPrice);
    // console.log('ethUsdPrice', ethUsdPrice);

    hasErrored = hasErrored || (!bitcarUsdPrice || !ethUsdPrice);

    // console.log('BITCAR/USD Price:', bitcarUsdPrice);
    // console.log('ETH/USD Price:', ethUsdPrice);

    let bitcarUsd = new BigNumber(NaN);
    let bitcarUsdDisplay = undefined;
    let ethUsd = new BigNumber(NaN);
    let usdBitcar = new BigNumber(NaN);
    let ethBitcar = new BigNumber(NaN);
    let bitcarEth = new BigNumber(NaN);
    let isTickerOnline = false;
    
    if(!hasErrored && bitcarUsdPrice !== tickerInvalidRequireNumber && ethUsdPrice !== tickerInvalidRequireNumber) {
        
        bitcarUsd = convertFromSolidityNumber(new BigNumber(bitcarUsdPrice));
        ethUsd = convertFromSolidityNumber(new BigNumber(ethUsdPrice));
        usdBitcar = bitcarToUSD(new BigNumber(1), bitcarUsd);
        ethBitcar = getNumberToDisplay(usdBitcar.multipliedBy(ethUsd));
        bitcarEth = getNumberToDisplay(new BigNumber(1).div(ethBitcar));

        bitcarUsdDisplay = getBitCarUsdDisplayValue(bitcarUsd);

        isTickerOnline = areTickerValuesValid([bitcarUsd, ethUsd, usdBitcar, ethBitcar, bitcarEth]);
    }

    platformWarning(isTickerOnline ? undefined : new ErrorWrapper(TICKER_WARNING_WITH_RETRY));

    let tickerValues = { isTickerOnline: isTickerOnline, bitcarUsdDisplay: bitcarUsdDisplay, bitcarUsd: bitcarUsd, bitcarEth: bitcarEth, ethUsd: ethUsd, ethBitcar:ethBitcar, usdBitcar: usdBitcar };
    store.dispatch(setEthereumTickers(tickerValues));

    return tickerValues;
}

export const refreshTicker = async (web3) => {
    const ticker = await getOrLoadPlatformContract("Ticker", web3);
    return setBitCarPricing(ticker);
}

export const initialiseTicker = async (web3) => {
    const ticker = await getOrLoadPlatformContract("Ticker", web3);
    
    logToConsoleInDev("Ticker Address", ticker.address);

    let tickerChangeEvent = new BlockchainEvent(PLATFORM_EVENT_TICKER_RATECHANGE, {fromBlock:"latest"} 
        , (error, event) => {

            let currency = event.returnValues.currency;
            // console.log("ticker event fired", event);
            if(currency !== "BTC") {
                setBitCarPricing(ticker);
            }
        }
    );
    
    startPlatformEvent(tickerChangeEvent, ticker.events.RateChange);
    setBitCarPricing(ticker);

    store.dispatch(tickerIsInitialised());

    return ticker;
}

const areTickerValuesValid = (pricesToCheck) => {
    let isValid = true;

    for (let index = 0; index < pricesToCheck.length; index++) {
        const price = pricesToCheck[index];

        if(!isValid) {
            break;
        }

        isValid = !isNaN(price) && price.isGreaterThan(0);
    }

    return isValid;
}

const getBitCarUsdDisplayValue = (bigNumberValue) => {

    if(!bigNumberValue || bigNumberValue.isNaN()) {
        return '';
    }

    const currentDecimals = bigNumberValue.decimalPlaces();
    return bigNumberValue.isGreaterThanOrEqualTo(10) ? bigNumberValue.toFormat(DISPLAY_DECIMALS_USD) : bigNumberValue.toFormat(currentDecimals < 4 ? currentDecimals : 4);
}
