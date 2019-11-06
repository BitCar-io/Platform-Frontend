import { ADD_USER_EVENT, CLEAR_PORTFOLIO_ASSETS, RESET_USEREVENT_STATE, SET_BITCAR_BALANCE, SET_ETHER_BALANCE, UPDATE_PORTFOLIO_ASSET, REMOVE_PORTFOLIO_ASSET, SET_CURRENT_PORTFOLIO, SET_PORTFOLIO_TOTAL, SET_PORTFOLIO_LOADED, SET_USER_LOGGED_OUT, CLEAR_ETHER_BALANCES, SET_USER_JUST_REGISTERED } from '../actions';
import * as _ from 'lodash';

const initialState = {
    events: [],
    bitcarBalance: [],
    bitcarDisplayBalance: [],
    etherDisplayBalances: [],
    portfolioAssets: undefined,
    portfolioLoaded: false,
    currentPortfolio: undefined,
    assetTotal: 0,
    isUserLoggedOut: true,
    hasJustRegistered: false
};

export const UserStateReducer = (state = initialState, action) => {
  switch (action.type) {

    case ADD_USER_EVENT:
    {
        return {
            ...state, events: {
                ...state.events, [action.eventType]: action.event
            }
          };
    }

    case CLEAR_PORTFOLIO_ASSETS: {
        return {...state, portfolioAssets: initialState.portfolioAssets, portfolioLoaded: initialState.portfolioLoaded,
            currentPortfolio: initialState.currentPortfolio, assetTotal: initialState.assetTotal};
    }

    case CLEAR_ETHER_BALANCES: {
        return {...state, etherDisplayBalances: initialState.etherDisplayBalances};
    }

    case RESET_USEREVENT_STATE:
        // console.log("RESET USER STATE");
        return {...state, events: initialState.events,
            bitcarBalance: initialState.bitcarBalance,
            bitcarDisplayBalance: initialState.bitcarDisplayBalance,
            etherDisplayBalances: initialState.etherDisplayBalances,
            hasJustRegistered: false};

    case UPDATE_PORTFOLIO_ASSET:
    {
        // console.log("Update user portfolio", action);
        return {
            ...state, portfolioAssets: {
                ...state.portfolioAssets, [action.portfolioAsset.address]: action.portfolioAsset
            }
        };
    }
    case REMOVE_PORTFOLIO_ASSET:
    {
        // console.log("Remove from user portfolio", action.address);
        return { ...state, portfolioAssets: _.keyBy(_.filter(state.portfolioAssets, (asset) => { return asset.address !== action.address; }), 'address') }
    }

    case SET_CURRENT_PORTFOLIO: {
        return { ...state, currentPortfolio: action.address };
    }

    case SET_USER_JUST_REGISTERED: {
        return {...state, hasJustRegistered: true};
    }

    case SET_PORTFOLIO_LOADED:
    {
        return { ...state, portfolioLoaded:action.isLoaded };
    }

    case SET_PORTFOLIO_TOTAL:
    {
        return { ...state, assetTotal:action.assetTotal };
    }

    case SET_BITCAR_BALANCE:
    {
        return { ...state, bitcarBalance: { ...state.bitcarBalance, [action.value.address]:action.value.bitcarBalance },
            bitcarDisplayBalance: { ...state.bitcarDisplayBalance, [action.value.address]:action.value.bitcarDisplayBalance }
        };
    }

    case SET_ETHER_BALANCE:
    {
        return { ...state, etherDisplayBalances: { ...state.etherDisplayBalances, [action.value.address]:action.value.balance } };
    }

    case SET_USER_LOGGED_OUT: {
        return { ...state, isUserLoggedOut: action.value };
    }

    default:
      return state;
  }
};

