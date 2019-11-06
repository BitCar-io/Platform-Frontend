import * as _ from 'lodash';
import { TOGGLE_PENDING, TOGGLE_USER_CREATION_PENDING, WEB3_INITIALISED, TICKER_INITIALISED, SET_BUY_MODAL_OPEN,
        ADD_DEPLOYED_CONTRACT, SET_CURRENT_USER, SET_COINBASE, SET_LOCAL_PORTFOLIO_WALLETS, SET_PLATFORM_TOKEN_CONTRACT, SET_CONNECTED_NETWORK, SET_PLATFORM_ERROR, SET_PLATFORM_WARNING } from '../actions';

  const initialState = {
    isPending: false,
    isBuyModalOpen: false,
    userCreationPending: false,
    coinbase: undefined,
    assetRegistrationForm_make: undefined,
    assetRegistrationForm_model: undefined,
    contracts: [],
    currentUser: undefined,
    platformErrorMessage: undefined,
    platformWarningMessage: undefined,
    platformTokenContract: undefined,
    localUserWallets: undefined,
    tickerIsInitialised: false,
    connectedNetwork: undefined,
    web3Status: undefined
  };
  
  export const UIstateReducer = (state = initialState, action) => {
    switch (action.type) {
  
      case WEB3_INITIALISED:
        return { ...state, web3: action.payload.web3Instance, web3Status: action.payload.web3Instance ? 'intialised' : null}

      case TICKER_INITIALISED:
        return { ...state, tickerIsInitialised: true}

      case SET_PLATFORM_TOKEN_CONTRACT:
        return { ...state, platformTokenContract: action.value }
  
      case ADD_DEPLOYED_CONTRACT:
        return { ...state, contracts: [...state.contracts, action.deployedContract] }
  
      case TOGGLE_PENDING:
        return { ...state, isPending: action.isPending };
  
      case TOGGLE_USER_CREATION_PENDING:
        return { ...state, userCreationPending: action.userCreationPending };
  
      case SET_CURRENT_USER:
        return { ...state, currentUser: action.user };
        
      case SET_COINBASE:
        return { ...state, coinbase: action.coinbase };

      case SET_BUY_MODAL_OPEN:
      return { ...state, isBuyModalOpen: action.value };

      case SET_LOCAL_PORTFOLIO_WALLETS: {
        return { ...state, localUserWallets: action.wallets};
      }

      case SET_PLATFORM_ERROR: {
        return { ...state, platformErrorMessage: action.platformErrorMessage};
      }

      case SET_PLATFORM_WARNING: {
        return { ...state, platformWarningMessage: action.platformWarningMessage};
      }

      case SET_CONNECTED_NETWORK: {
        return { ...state, connectedNetwork: action.connectedNetwork};
      }
  
      case 'SET_TRANSACTIONS':
        return { ...state, transactions: action.transactions };
      
      case 'SET_ASSET_REGISTRATION_FORM_MAKE':
        // console.log(action);
        return { ...state, assetRegistrationForm_make: action.make };
      
      case 'SET_ASSET_REGISTRATION_FORM_MODEL':
      // console.log(action);
        return { ...state, assetRegistrationForm_model: action.model };
      default:
        return state;
    }
  };
