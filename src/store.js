import { createStore } from 'redux'
import reducer from './reducer'

const initialState = {
  // web3: {}
}

const store = createStore(
  reducer,
  initialState
);
export default store;