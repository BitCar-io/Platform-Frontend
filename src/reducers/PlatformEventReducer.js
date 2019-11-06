import { ADD_PLATFORM_EVENT, ADD_PROCESSED_EVENT, RESET_PLATFORMEVENT_STATE, SET_ETHEREUM_TICKERS, SET_BITCOIN_USD_TICKER, SET_ASSET_BALANCE } from '../actions';
import BigNumber from 'bignumber.js';

const processedEventCache = 30;

const initialState = {
    events: [],
    bitcarEth: new BigNumber(NaN),
    bitcarUsd: new BigNumber(NaN),
    bitcarUsdDisplay: undefined,
    bitcoinUsd: new BigNumber(NaN),
    ethBitcar: new BigNumber(NaN),
    ethUsd: new BigNumber(NaN),
    isTickerOnline: false,
    assetBalances: [],
    processedEvents:[]
};

export const PlatformEventReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_PLATFORM_EVENT:
        {
            return {
                ...state, events: {
                    ...state.events, [action.eventType]: action.event
                }
            };
        }

        case RESET_PLATFORMEVENT_STATE:
            return initialState;
    
        case SET_ETHEREUM_TICKERS:
        {
            return { ...state, isTickerOnline: action.value.isTickerOnline, bitcarUsdDisplay: action.value.bitcarUsdDisplay, bitcarUsd: action.value.bitcarUsd, bitcarEth: action.value.bitcarEth, ethBitcar: action.value.ethBitcar, ethUsd: action.value.ethUsd, usdBitcar: action.value.usdBitcar };
        }
    
        case SET_BITCOIN_USD_TICKER:
        {
          return { ...state, bitcoinUsd: action.value };
        }
        
        case SET_ASSET_BALANCE:
        {
            return { ...state, assetBalances: { ...state.assetBalances, [action.address]:action.balance } };
        }

        case ADD_PROCESSED_EVENT:
        {
            if(state.processedEvents.length < processedEventCache) {
                return { ...state, processedEvents: [...state.processedEvents, action.eventId] };
            } else {
                return { ...state, processedEvents: [...state.processedEvents.filter((item, index) => { return index === 0}), action.eventId]};
            }
        }
    
        default:
          return state;
      }
};

