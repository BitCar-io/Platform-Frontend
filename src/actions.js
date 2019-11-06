
// Actions
export const WEB3_INITIALISED = 'WEB3_INITIALISED';
export const TICKER_INITIALISED = 'TICKER_INITIALISED';
export const SET_ASSET_CONTRACTS = 'SET_ASSET_CONTRACTS';
export const TOGGLE_PENDING = 'TOGGLE_PENDING';
export const TOGGLE_USER_CREATION_PENDING = 'TOGGLE_USER_CREATION_PENDING';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_COINBASE = 'SET_COINBASE';
export const SET_ASSET_REGISTRATION_FORM = 'SET_ASSET_REGISTRATION_FORM';
export const ADD_LOADED_ASSET = 'ADD_LOADED_ASSET';
export const SET_ALL_LOADED_ASSETS = 'SET_ALL_LOADED_ASSETS';
export const SET_ALL_ASSETS = 'SET_ALL_ASSETS';
export const ADD_DEPLOYED_CONTRACT = 'ADD_DEPLOYED_CONTRACT';
export const ADD_UNAPPROVED_ASSET = 'ADD_UNAPPROVED_ASSET';
export const REMOVE_UNAPPROVED_ASSET = 'REMOVE_UNAPPROVED_ASSET';
export const UPDATE_UNAPPROVED_ASSET = 'UPDATE_UNAPPROVED_ASSET';
export const SET_ALL_UNAPPROVED_ASSETS = 'SET_ALL_UNAPPROVED_ASSETS';
export const SET_PLATFORM_TOKEN_CONTRACT = 'SET_PLATFORM_TOKEN_CONTRACT';
export const SET_PLATFORM_ERROR = 'SET_PLATFORM_ERROR';
export const SET_PLATFORM_WARNING = 'SET_PLATFORM_WARNING';
export const SET_LOCAL_PORTFOLIO_WALLETS = 'SET_LOCAL_PORTFOLIO_WALLETS';
export const SET_USER_LOGGED_OUT = 'SET_USER_LOGGED_OUT';
export const SET_CONNECTED_NETWORK = 'SET_CONNECTED_NETWORK';
export const SET_BUY_MODAL_OPEN = 'SET_BUY_MODAL_OPEN';
export const SET_USER_JUST_REGISTERED = 'SET_USER_JUST_REGISTERED';

// web3 event actions
export const ADD_PLATFORM_EVENT = 'ADD_PLATFORM_EVENT';
export const ADD_PROCESSED_EVENT = 'ADD_PROCESSED_EVENT';
export const RESET_PLATFORMEVENT_STATE = 'RESET_PLATFORMEVENT_STATE';
export const ADD_USER_EVENT = 'ADD_USER_EVENT';
export const RESET_USEREVENT_STATE = 'RESET_USEREVENT_STATE';
export const SET_BITCAR_BALANCE = 'SET_BITCAR_BALANCE';
export const CLEAR_ETHER_BALANCES = 'CLEAR_ETHER_BALANCES';
export const SET_ETHER_BALANCE = 'SET_ETHER_BALANCE';
export const SET_BITCOIN_USD_TICKER = 'SET_BITCOIN_USD_TICKER';
export const SET_ETHEREUM_TICKERS = 'SET_ETHEREUM_TICKERS';

export const CLEAR_PORTFOLIO_ASSETS = 'CLEAR_PORTFOLIO_ASSETS';
export const UPDATE_PORTFOLIO_ASSET = 'UPDATE_PORTFOLIO_ASSET';
export const REMOVE_PORTFOLIO_ASSET = 'REMOVE_PORTFOLIO_ASSET';
export const SET_PORTFOLIO_TOTAL = 'SET_PORTFOLIO_TOTAL';
export const SET_PORTFOLIO_LOADED = 'SET_PORTFOLIO_LOADED';
export const SET_CURRENT_PORTFOLIO = 'SET_CURRENT_PORTFOLIO';
export const SET_ASSET_BALANCE = 'SET_ASSET_BALANCE';
export const SET_UNAPPROVED_ASSET_ADMIN_APPROVAL_PROGRESS = 'SET_UNAPPROVED_ASSET_ADMIN_APPROVAL_PROGRESS';
export const SET_UNAPPROVED_ASSET_FEEMANAGER_PROGRESS = 'SET_UNAPPROVED_ASSET_FEEMANAGER_PROGRESS';
export const SET_ALL_ASSETS_APPROVALSTATE = 'SET_ALL_ASSETS_APPROVALSTATE';

// Creditcard steps
export const SET_CREDITCARD_BUY_NOW = 'SET_CREDITCARD_BUY_NOW';
export const SET_CREDITCARD_STEPS = 'SET_CREDITCARD_STEPS';
export const SET_CREDITCARD_PAYMENT_REJECTED = 'SET_CREDITCARD_PAYMENT_REJECTED';
export const SET_CREDITCARD_PAYMENT_COMPLETE = 'SET_CREDITCARD_PAYMENT_COMPLETE';
export const SET_CREDITCARD_PAYMENT_PENDING = 'SET_CREDITCARD_PAYMENT_PENDING';
export const SET_FIAT_PAYMENT_TOKEN = 'SET_FIAT_PAYMENT_TOKEN'
export const SET_USER_FIAT_TOKEN = 'SET_USER_FIAT_TOKEN';
export const UPDATE_CREDITCARD_CUSTOMERDETAILS = 'UPDATE_CREDITCARD_CUSTOMERDETAILS';
export const UPDATE_CREDITCARD_CURRENTSTEP = 'UPDATE_CREDITCARD_CURRENTSTEP';
export const UPDATE_CREDITCARD_PURCHASE = 'UPDATE_CREDITCARD_PURCHASE';

// Action creators
export function web3Initialised(results) {
  return { type: WEB3_INITIALISED, payload: results}
}

export function setAssetContracts(assetContracts) {
  return { type: SET_ASSET_CONTRACTS, assetContracts }
}

export function addDeployedContract(contractName, contract) {
  const deployedContract = {
    contractName: contractName,
    contract: contract
  }
  return { type: ADD_DEPLOYED_CONTRACT, deployedContract }
}

export function addLoadedAsset(asset) {
  return {type: ADD_LOADED_ASSET, asset: asset}
}

export function addPlatformEvent(eventType, event) {
  return {type: ADD_PLATFORM_EVENT, eventType: eventType, event: event};
}

export function addProcessedEvent(eventId) {
  return {type: ADD_PROCESSED_EVENT, eventId: eventId};
}

export function addUserEvent(eventType, event) {
  return {type: ADD_USER_EVENT, eventType: eventType, event: event};
}

export function addUnapprovedAsset(unapprovedAsset) {
  return {type: ADD_UNAPPROVED_ASSET, unapprovedAsset: unapprovedAsset}
}

export function clearEtherBalances() {
  return {type: CLEAR_ETHER_BALANCES}
}

export function clearPortfolioAssets() {
  return {type: CLEAR_PORTFOLIO_ASSETS}
}

export function clearUnapprovedAssets() {
  return {type: SET_ALL_UNAPPROVED_ASSETS, unapprovedAssets: null}
}

export function removePortfolioAsset (assetContractAddress) {
  return {type: REMOVE_PORTFOLIO_ASSET, address: assetContractAddress}
}

export function removeUnapprovedAsset(unapprovedAssetAddress) {
  return {type: REMOVE_UNAPPROVED_ASSET, address: unapprovedAssetAddress}
}

export function resetUserState() {
  return {type: RESET_USEREVENT_STATE};
}

export function setAllAssets(allAssets) {
  return {type: SET_ALL_ASSETS, allAssets}
}

export function setAllLoadedAssets(loadedAssets) {
  return {type: SET_ALL_LOADED_ASSETS, loadedAssets}
}

export function setAllUnapprovedAssets(unapprovedAssets) {
  return {type: SET_ALL_UNAPPROVED_ASSETS, unapprovedAssets: unapprovedAssets}
}

export function setAssetApprovalState(assetContractAddress, newApprovalState) {
  return {type: SET_ALL_ASSETS_APPROVALSTATE, assetContractAddress: assetContractAddress, approvalState: newApprovalState};
}

export function setAssetBalance(assetBalance) {
  return { type: SET_ASSET_BALANCE, address: assetBalance.address, balance: assetBalance };
}

export function setAssetRegistrationForm(form) {
  return { type: SET_ASSET_REGISTRATION_FORM, form }
}

export function setBitCarBalance(balance) {
  return {type: SET_BITCAR_BALANCE, value: balance}
}

export function setBitcoinTicker(value) {
  return {type: SET_BITCOIN_USD_TICKER, value: value };
}

export function setCoinbase(coinbase) {
  return { type: SET_COINBASE, coinbase}
}

export function setCreditCardBuyNow(fees, asset) {
  return {type: SET_CREDITCARD_BUY_NOW, fees: fees, asset: asset };
}

export function setCreditCardPaymentComplete(redemptionCode) {
  return {type: SET_CREDITCARD_PAYMENT_COMPLETE, redemptionCode: redemptionCode };
}

export function setCreditCardPaymentPending(isPending) {
  return {type: SET_CREDITCARD_PAYMENT_PENDING, value: isPending };
}

export function setCreditCardPaymentRejected() {
  return {type: SET_CREDITCARD_PAYMENT_REJECTED };
}

export function setCreditCardSteps(steps, initialStep) {
  return {type: SET_CREDITCARD_STEPS, steps: steps, initialStep: initialStep};
}

export function setCurrentUser(user) {
  return { type: SET_CURRENT_USER, user}
}

export function setCurrentPortfolio(portfolioAddress) {
  return { type: SET_CURRENT_PORTFOLIO, portfolioAddress}
}

export function setEtherBalance(etherDisplayBalance) {
  return {type: SET_ETHER_BALANCE, value: etherDisplayBalance}
}

export function setEthereumTickers(tickerValues) {
  return {type: SET_ETHEREUM_TICKERS, value: tickerValues};
}

export function setFiatPaymentToken(value) {
  return {type: SET_FIAT_PAYMENT_TOKEN, value: value};
}

export function setInvoiceModalShown(isShown) {
  return {type: SET_BUY_MODAL_OPEN, value: isShown};
}

export function setLocalPortfolioWallets(wallets) {
  return {type: SET_LOCAL_PORTFOLIO_WALLETS, wallets: wallets}
}

export function setPlatformError(platformErrorMessage) {
  return {type: SET_PLATFORM_ERROR, platformErrorMessage: platformErrorMessage}
}

export function setPlatformWarning(platformWarningMessage) {
  return {type: SET_PLATFORM_WARNING, platformWarningMessage: platformWarningMessage}
}

export function setPlatformTokenContract(platformTokenContract) {
  return {type: SET_PLATFORM_TOKEN_CONTRACT, value: platformTokenContract};
}

export function setPortfolioLoaded(isLoaded) {
  return {type: SET_PORTFOLIO_LOADED, isLoaded: isLoaded}
}

export function setUnapprovedAssetAdminApprovalProgress(assetContractAddress, adminApprovalProgress) {
  return {type: SET_UNAPPROVED_ASSET_ADMIN_APPROVAL_PROGRESS, assetContractAddress: assetContractAddress, adminApprovalProgress: adminApprovalProgress};
}

export function setUnapprovedAssetFeeManagerProgress(assetContractAddress, feeManagerProgress) {
  return {type: SET_UNAPPROVED_ASSET_FEEMANAGER_PROGRESS, assetContractAddress: assetContractAddress, feeManagerProgress: feeManagerProgress};
}
SET_USER_JUST_REGISTERED
export function setUserLoggedOut(value) {
  return {type: SET_USER_LOGGED_OUT, value: value}
}

export function setUserJustRegistered() {
  return {type: SET_USER_JUST_REGISTERED}
}

export function setUserFiatToken(userFiatToken, userData) {
  return {type: SET_USER_FIAT_TOKEN, userFiatToken: userFiatToken, purchasingUser: userData}
}

export function setUserTotal(assetTotal) {
  return {type: SET_PORTFOLIO_TOTAL, assetTotal: assetTotal}
}

export function setConnectedNetwork(connectedNetwork) {
  return {type: SET_CONNECTED_NETWORK, connectedNetwork: connectedNetwork}
}

export function tickerIsInitialised() {
  return { type: TICKER_INITIALISED }
}

export function togglePending(isPending) {
  return { type: TOGGLE_PENDING, isPending }
}

export function toggleUserCreationPending(userCreationPending) {
  return { type: TOGGLE_USER_CREATION_PENDING, userCreationPending }
}

export function updateCreditCardPurchase(fees) {
  return {type: UPDATE_CREDITCARD_PURCHASE, fees: fees};
}

export function updateCurrentCreditCardStep(value) {
  return {type: UPDATE_CREDITCARD_CURRENTSTEP, value: value};
}

export function updateCustomerDetails(isAdvancedData, value) {
  return {type: UPDATE_CREDITCARD_CUSTOMERDETAILS, isAdvancedData: isAdvancedData, value: value};
}

export function updatePortfolioAsset(portfolioAsset) {
  return {type: UPDATE_PORTFOLIO_ASSET, portfolioAsset: portfolioAsset}
}

export function updateUnapprovedAsset(unapprovedAsset) {
  // console.log("Unapproved asset action hit", unapprovedAsset);
  return {type: UPDATE_UNAPPROVED_ASSET, unapprovedAsset: unapprovedAsset}
}
