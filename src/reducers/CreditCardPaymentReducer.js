import { SET_CREDITCARD_PAYMENT_COMPLETE, SET_CREDITCARD_PAYMENT_REJECTED, SET_CREDITCARD_STEPS, SET_FIAT_PAYMENT_TOKEN, SET_USER_FIAT_TOKEN, SET_CREDITCARD_BUY_NOW, SET_CREDITCARD_PAYMENT_PENDING, UPDATE_CREDITCARD_CURRENTSTEP, UPDATE_CREDITCARD_CUSTOMERDETAILS, UPDATE_CREDITCARD_PURCHASE } from '../actions';
import * as _ from 'lodash';

const initialState = {
  buyNow: false,
  paymentSuccessful: false,
  purchasePending: false,
  purchaseDate: undefined,
  isUsingPaypal: true,
  currentStep: 0,
  assetToPurchase: undefined,
  purchasingUser: undefined,
  purchaseFees: undefined,
  paymentRejected: undefined,
  userFiatToken: undefined,
  fiatPaymentToken: undefined,
  steps: [],
  customerDetails: {
        email: {},
        emailConfirmation: {},
        firstName: {},
        lastName: {},
        // home address
        line1: {},
        line2: {},
        city: {},
        state: {},
        postcode: {},
        country: {}
    },
    customerAmlDetails: {
      dateOfBirth: {},
      // tax address
      line1: {},
      line2: {},
      city: {},
      state: {},
      postcode: {},
      country: {},
      placeOfBirth: {},
      nationalities: {},
      idCountry:{},
      idNumber: {},
      idType: {},
      isTaxAddressSameAsHome: {},
      occupation: {},
      employer: {},
  }
};

export const CreditCardPaymentReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_CREDITCARD_PAYMENT_COMPLETE: {
      const currentStep = state.steps.length;
      return {...state, redemptionCode: action.redemptionCode, currentStep: currentStep, paymentSuccessful: true, purchaseDate: new Date()}
    }

    case SET_CREDITCARD_PAYMENT_PENDING: {
      return {...state, purchasePending: action.value }
    }

    case SET_CREDITCARD_PAYMENT_REJECTED: {
      return {...state, paymentRejected: true, fiatPaymentToken: undefined}
    }

    case SET_CREDITCARD_BUY_NOW: {
      return {...state, buyNow: true, purchaseFees: action.fees, assetToPurchase: action.asset}
    }

    case SET_CREDITCARD_STEPS: {
        return {...initialState, purchaseFees: state.purchaseFees, assetToPurchase: state.assetToPurchase, steps: action.steps, currentStep:action.initialStep ? action.initialStep : 0 };
    }

    case SET_USER_FIAT_TOKEN: {
      return {...state, userFiatToken: action.userFiatToken, purchasingUser: action.purchasingUser};
    }

    case SET_FIAT_PAYMENT_TOKEN: {
      return {...state, fiatPaymentToken: action.value};
    }

    case UPDATE_CREDITCARD_CURRENTSTEP: {
      return {...state, currentStep: action.value };
    }

    case UPDATE_CREDITCARD_PURCHASE: {
      return {...state, purchaseFees: action.fees};
    }

    case UPDATE_CREDITCARD_CUSTOMERDETAILS: {

      if(action.isAdvancedData) {
        return {...state, customerAmlDetails: action.value };
      }

      return {...state, customerDetails: action.value };
    }

    default:
      return state;
  }
};

