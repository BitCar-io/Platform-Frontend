import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { AssetStateReducer } from "./reducers/AssetStateReducer";
import { UIstateReducer } from "./reducers/UIstateReducer";
import { PlatformEventReducer } from "./reducers/PlatformEventReducer";
import { UserStateReducer } from "./reducers/UserStateReducer";
import { CreditCardPaymentReducer } from "./reducers/CreditCardPaymentReducer";

const reducer = combineReducers({
  AssetState: AssetStateReducer,
  CreditCardPayment: CreditCardPaymentReducer,
  routing: routerReducer,
  UIstate: UIstateReducer,
  PlatformEvent: PlatformEventReducer,
  UserState: UserStateReducer
});

export default reducer;
