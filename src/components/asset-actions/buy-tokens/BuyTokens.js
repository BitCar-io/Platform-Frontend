import React from "react";import store from "../../../store";
import { setCreditCardBuyNow } from "../../../actions";
import { Alert, Row, Col, Form, Input, Button, Checkbox } from "antd";
import { connect } from 'react-redux';
import { convertFromSolidityNumber } from '../../../util/helpers';
import Fees from "../../../classes/Fees";
import * as _ from 'lodash';
import Web3ResponseHandler from '../../Web3ResponseHandler';
import { Link } from "react-router-dom";
import { doesAllowanceNeedToBeSet, setAllowance, transferTokens, isPurchaseValid, isWhitelistValid, getMinimumPurchaseQty, isCreditCardPurchaseValid } from '../../../core/tokenPurchase';
import PaymentBreakdown from './PaymentBreakdown';
import {FRIENDLY_ERROR_MESSAGES} from '../../../util/web3/errorMessaging';
import { callEthereumMethod, processError } from "../../../util/web3/web3Wrapper";
import LoadingIndicator from "../../LoadingIndicator";
import { BUY_BUTTON_TEXT, DISPLAY_DECIMALS_USD, HOT_WALLET_TEXT } from "../../../util/globalVariables";
import Web3SendResponse from "../../../classes/Web3SendResponse";
import BigNumber from "bignumber.js";
import { URL_TERMS_AND_CONDITIONS, URL_RETURNS_POLICY, URL_MEMBERSHIP_REGISTRATION } from "../../../util/platformNavigation";
import PriceBubble from "./PriceBubble";
import { setUserEthereumBalance, haveUserWalletsChanged } from "../../../core/user";
import PaymentType, { PaymentTypeValue } from "./PaymentType";
import Login from "../../header-bar/Login";

// TODO replace min/max with values from contract
const maximumTokenBuy = 30000;

const bitcarBadge = require('../../../logos/bitcar_badge.svg');

const ethereumBadge = "fab fa-ethereum";

class BuyTokens extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buyFeesModalVisible: true,
            pending: false,
            validationPending: false,
            bitcarTokenContract: undefined,
            web3Response: undefined,
            purchasedQty: undefined,
            termsChecked: false,
            tokenQtyValid: true,
            breakdownShown: false,
            buyFees: undefined,
            isWhitelistOk: false,
            hasCheckedWhitelist: false,
            percentToBuy: 0,
            paymentType: undefined,
            minimumPurchaseAmount: this.getMinimumPurchaseQuantity()
        };
    }

    componentDidMount(){
        this.checkWhitelist(this.props.coinbase);
        this.getTotalDue(this.props.asset.minPurchaseAmountNumber, this.props.asset);
        setUserEthereumBalance(this.props.web3, this.props.currentUser);
    }

    componentDidUpdate(prevProps) {
        let hasTickerChanged = this.props.asset && (!prevProps.bitcarUsd.isEqualTo(this.props.bitcarUsd) || !prevProps.ethUsd.isEqualTo(this.props.ethUsd));
        if (this.props.isTickerOnline && hasTickerChanged) {
            this.getTotalDue(this.props.form.getFieldValue("qtyToBuy"), this.props.asset);
        }

        if(prevProps.coinbase !== this.props.coinbase) {
            this.checkWhitelist(this.props.coinbase);
            if(!(this.props.currentUser && this.props.currentUser.isTrader)) {
                this.setState({paymentType: PaymentTypeValue.PAYPAL});
            }
        }

        if(prevProps.assetBalance.qtyRemaining !== this.props.assetBalance.qtyRemaining) {
            this.setState({minimumPurchaseAmount: this.getMinimumPurchaseQuantity()});
        }

        if(prevProps.coinbase != this.props.coinbase || haveUserWalletsChanged(prevProps.currentUser, this.props.currentUser)) {
            setUserEthereumBalance(this.props.web3, this.props.currentUser);
        }
    }

    checkWhitelist = async coinbase => {
        const isWhitelistOk = coinbase && await isWhitelistValid(this.props.web3, coinbase, this.props.asset);
        this.setState({isWhitelistOk: isWhitelistOk, hasCheckedWhitelist: true});
    }

    getMinimumPurchaseQuantity = () => {
        return convertFromSolidityNumber(getMinimumPurchaseQty(this.props.asset.minPurchaseAmount, this.props.assetBalance.qtyRemaining));
    }

    async getTotalDue(qty, asset) {
        // console.log(`Getting total due for qty: ${qty}`, asset);
        const tokenQty = new BigNumber(qty);
        let fees = new Fees(tokenQty, asset.pafPerToken, asset.escrowPerToken, asset.ptfPerToken, this.props.bitcarUsd, this.props.ethUsd, asset.tokenBitCarPercent, asset.tokenEthereumPercent, asset.requiresEth);

        const percentValue = (tokenQty.dividedBy(convertFromSolidityNumber(asset.totalTokenSupply))).multipliedBy(100);
        const percentToBuy = percentValue.toFormat(3);

	// console.log(`Fees getTotalDue for qty: ${qty}`, fees);
        this.setState({buyFees: fees, percentToBuy: percentToBuy});
    }

    purchaseTokens = qty => {

        this.setState({ pending: true, validationPending: true, web3Response: undefined });
        
        new Promise(async (resolve, reject) => {
            const asset = this.props.asset;

            await this.getTotalDue(qty, asset);
            const totalBitCar = this.state.buyFees.totalBitCar;
            const web3 = this.props.web3;
            const coinbase = this.props.coinbase;
            let hasErrored = false;

            await isPurchaseValid(web3, coinbase, asset, qty, this.state.buyFees.totalEthereum).catch(web3Response => {
                hasErrored = true;
                reject(web3Response);
            });

            if(hasErrored) {
                console.error('Error whilst validating purchase');
                return;
            }

            this.setState({validationPending: false});

            const needsAllowanceChange = await doesAllowanceNeedToBeSet(web3, coinbase, asset.address, totalBitCar).catch(web3Response => {
                hasErrored = true;
                console.error("Error Checking User BitCar Allowance");
                reject(web3Response);
            });

            if(!hasErrored && needsAllowanceChange) {
                this.props.setBuyStatus(this.props.buyStatuses.allowance);

                await setAllowance(web3, coinbase, asset.address, totalBitCar).catch(web3Response => {
                    hasErrored = true;
                    console.error("Error Setting Allowance");                    
                    reject(web3Response);
                });
            }

            if(!hasErrored) {
                resolve(this.buyTokens(asset, qty));
            }

        }).then(web3Response => {
            // console.log("Successfully bought", web3Response);

            const receipt = web3Response.receipt;

            if(!receipt) {
                console.error('No receipt found in web3Response after purchase!', web3Response);
                this.buyProcessCompleted();
                return;
            }

            this.props.asset.assetContract.getPastEvents('BoughtAssetTokens', {filter:{user: this.props.coinbase, transactionHash: receipt.transactionHash}, fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber}).then(events => {
                if(!events) {
                    console.error('No purchase events found for this receipt!', receipt);
                    this.buyProcessCompleted();
                } else {
                    this.props.setBuyStatus(this.props.buyStatuses.purchaseComplete);
                    this.props.setReceipt(events[0], this.props.asset);
                }
            });

        }).catch(error => {

            let web3Response = error;
            if(!(error instanceof Web3SendResponse)) {
                web3Response = processError(error);
            }

            console.error("Error Output", web3Response);
            this.setState({web3Response: web3Response });
            this.buyProcessCompleted();
        });
    }

    buyProcessCompleted = () => {
        this.setState({pending: false, validationPending: false});
        this.props.setBuyStatus(this.props.buyStatuses.purchaseComplete);
    }

    buyTokens = async (asset, qty) => {
        this.props.setBuyStatus(this.props.buyStatuses.purchase);
        // console.log(`Buy qty ${qty} calculated fees object:`, this.state.buyFees);
        return transferTokens(this.props.web3, this.props.coinbase, asset, qty, this.state.buyFees.totalEthereum);
    }

    async getAllowance (assetContractAddress) {
        const currentAllowance = await callEthereumMethod(this.state.bitcarTokenContract.methods.allowance(this.props.coinbase, assetContractAddress), {from: this.props.coinbase});
        // console.log("Current Allowance", currentAllowance);
        return parseFloat(currentAllowance);
    }

    handleBuyButtonClicked = event => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                this.purchaseTokens(new BigNumber(values["qtyToBuy"]));
            }
        });
    }

    validateBuyQty = (rule, value, callback) => {

        if(this.state.web3Response) {
            this.setState({web3Response: undefined});
        }

        if (value === undefined) {
            callback();
            return;
        }

        const numberValue = new BigNumber(value);

        const minPurchaseAmount = this.state.minimumPurchaseAmount;

        if (numberValue.isNaN() || numberValue.isLessThan(minPurchaseAmount) || numberValue.isGreaterThan(maximumTokenBuy) || (numberValue.mod(1).toString() !== '0') ) {
            this.setFeesToInvalid();
            callback(`Minimum purchase is ${minPurchaseAmount.toFormat(0)}, maximum per transaction is ${maximumTokenBuy}. Whole numbers only.`);
            return;
        }

        // Validation passed so update the form
        this.setState({tokenQtyValid: true});
        this.getTotalDue(value, this.props.asset);
        callback();
    }

    setFeesToInvalid = () => {
        let fees = new Fees(new BigNumber(0), this.props.asset.pafPerToken, this.props.asset.escrowPerToken, this.props.asset.ptfPerToken, this.props.bitcarUsd, this.props.ethUsd, this.props.asset.tokenBitCarPercent, this.props.asset.tokenEthereumPercent, this.props.asset.requiresEth);
        this.setState({tokenQtyValid: false, buyFees: fees, percentToBuy: 0});
    }

    onTermsChange = () => {
        this.setState({termsChecked: !this.state.termsChecked});
    }

    toggleBreakdown = () => {
        this.setState({ breakdownShown: !this.state.breakdownShown })
    }

    onPaymentTypeChange = (paymentType) => {
        this.setState({paymentType: paymentType});
    }

    resetPaymentOption = () => {
        this.setState({paymentType: undefined});
    }

    onPayPalButtonClick = event => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                this.paypalBuyNow(new BigNumber(values["qtyToBuy"]));
            }
        });
    }

    paypalBuyNow = async (qty) => {

        this.setState({ paypalPending: true, validationPending: true, web3Response: undefined });

        new Promise(async (resolve, reject) => {
            const asset = this.props.asset;

            await this.getTotalDue(qty, asset);
            let hasErrored = false;

            await isCreditCardPurchaseValid(asset, qty).catch(web3Response => {
                hasErrored = true;
                reject(web3Response);
            });

            if(hasErrored) {
                console.error('Error whilst validating purchase');
                return;
            }

            this.setState({validationPending: false});
    
            store.dispatch(setCreditCardBuyNow(this.state.buyFees, asset));

        }).catch(error => {

            let web3Response = error;
            if(!(error instanceof Web3SendResponse)) {
                web3Response = processError(error);
            }

            console.error("Error Output", web3Response);
            this.setState({web3Response: web3Response, pending: false });
        });
    }

    render() {
        const isCryptoPayment = this.state.paymentType === PaymentTypeValue.CRYPTOCURRENCY;
        const loadedAsset = this.props.asset;
        const { getFieldDecorator } = this.props.form;
        const userIsTrader = this.props.currentUser && this.props.currentUser.isTrader;

        const isTickerOnline = this.props.isTickerOnline;
        const unlockWalletWarning = isTickerOnline && (!this.props.currentUser || !this.props.currentUser.coinbase);
        const registrationWarning =  isTickerOnline && !unlockWalletWarning && !userIsTrader;
        const isConnectedWithColdWallet = this.props.currentUser.isConnectedWithColdWallet;

        const traderBitCarBalance = this.props.bitcarBalance[this.props.coinbase];
        const traderEthBalance = this.props.etherDisplayBalances[this.props.coinbase] ? new BigNumber(this.props.etherDisplayBalances[this.props.coinbase]) : new BigNumber(0);

        const bitcarTooLowWarning = isCryptoPayment && isTickerOnline && !registrationWarning && this.state.buyFees && traderBitCarBalance && traderBitCarBalance.isLessThan(this.state.buyFees.totalBitCar);        
        const ethereumTooLowWarning = isCryptoPayment && isTickerOnline && !registrationWarning && this.state.buyFees && traderEthBalance && traderEthBalance.isLessThan(convertFromSolidityNumber(this.state.buyFees.totalEthereum));        
        const whitelistWarning = isCryptoPayment && isTickerOnline && !registrationWarning && !bitcarTooLowWarning && !ethereumTooLowWarning && this.state.hasCheckedWhitelist && !this.state.isWhitelistOk;
        const addOnAfterTokenField = "fractions";//this.props.asset.tokenCode;
        const feesAreValid = this.state.buyFees && this.state.buyFees.tokenQty && this.state.buyFees.tokenQty.isGreaterThan(0);

        const hasWarning = bitcarTooLowWarning || ethereumTooLowWarning || whitelistWarning;

        return <Form>
                {isTickerOnline && <React.Fragment>
                    <Form.Item name="qtyToBuy" label="I would like to buy:" style={{marginBottom: 0}}>
                        {getFieldDecorator('qtyToBuy', { rules: [{ required: true, message: 'Please enter amount to buy...' }, 
                        {validator: this.validateBuyQty}], initialValue: this.state.minimumPurchaseAmount })(
                        //TODO:this.props.loadedAsset.availableTokens
                        <Input type="number" placeholder="Enter desired quantity..." id="qtyToBuy" addonAfter={addOnAfterTokenField} disabled={this.state.pending} min={this.state.minimumPurchaseAmount} max={maximumTokenBuy} />
                        )}
                    </Form.Item>
                    {this.state.paymentType !== PaymentTypeValue.CRYPTOCURRENCY && <div className="pay-step-content">
                        <PaymentType isDisabled={this.state.validationPending} isCryptoEnabled={userIsTrader} onPaymentTypeChange={this.onPaymentTypeChange} bitcarBadge={bitcarBadge} ethereumBadge={ethereumBadge} isEthereumRequired={loadedAsset.requiresEth} onPayPalButtonClick={this.onPayPalButtonClick} />
                    </div>}
                    {!isCryptoPayment && this.state.validationPending && <Alert type="warning" showIcon message="Validating quantity, please wait..." />}
                    {this.state.buyFees && isCryptoPayment && <span>
                        <h1 className="text-header-font header-total">Total Payment Due: USD ${this.state.buyFees.totalUsd_display} <span className="text-primary text-primary-font font-14 header-vertical-align"></span></h1>
                            <div className="align-center">
                                <Row>
                                    <PriceBubble header="BITCAR" image={<img src={bitcarBadge} width={26} alt="BitCar Badge" />}
                                        amountToPay={this.state.buyFees.displayTotalBitCar}
                                        amountInUsd={this.state.buyFees.bitCarTotalInUSD}
                                        currentBalance={this.props.bitcarDisplayBalance[this.props.coinbase]}
                                        hasCorrectBalance={!bitcarTooLowWarning}
                                    />
                                    { loadedAsset.requiresEth && <React.Fragment>
                                            <Col span={4} style={{marginTop: 20}}>
                                                <span style={{fontSize: 28}}>+</span>
                                            </Col>
                                            <PriceBubble header="ETHEREUM" image={<i className={`${ethereumBadge} currency-font-icon`} />}
                                                amountToPay={this.state.buyFees.displayTotalEthereum}
                                                amountInUsd={this.state.buyFees.totalEthInUSD}
                                                currentBalance={this.props.etherDisplayBalances[this.props.coinbase]}
                                                hasCorrectBalance={!ethereumTooLowWarning}
                                            />
                                        </React.Fragment>
                                    }
                                </Row>
                            </div>
                            <div className="font-14" style={{marginTop: 5}}>Based on exchange rates of 1 BitCar = USD ${this.props.bitcarUsdDisplay}{ loadedAsset.requiresEth && `, 1 Eth = USD $${this.props.ethUsd.toFormat(DISPLAY_DECIMALS_USD)}`}{/*.Set on TODO. Valid until TODO.*/}
                            </div>
                            <div onClick={this.toggleBreakdown} className="link-highlight payment-breakdown-link">
                                { this.state.breakdownShown ? 'Hide' : 'Show' } payment breakdown and delivery details
                            </div>
                            { this.state.breakdownShown && <div>
                                <hr />
                                <PaymentBreakdown hotWallet={this.props.currentUser ? this.props.currentUser.hotWallet : null} loadedAsset={loadedAsset} displayTokenBitCarCost={this.state.buyFees.displayTokenBitCarCost} 
                                    displayTotalEthereum={this.state.buyFees.displayTotalEthereum} displayTokenQty={this.state.buyFees.tokenQty.toFormat(0)} 
                                    displayBEE={this.state.buyFees.displayBEE} displayBEEinUSD={this.state.buyFees.displayBEEinUSD} 
                                    // displayPAF={this.state.buyFees.displayPAF} displayPAFinUSD={this.state.buyFees.displayPAFinUSD}
                                    // displayPTF={this.state.buyFees.displayPTF} displayPTFinUSD={this.state.buyFees.displayPTFinUSD}
                                    />
                                <hr />
                            </div> }
                    </span> }

                    <br />

                    {isCryptoPayment && this.state.isWhitelistOk && <div className="align-center">
                        {userIsTrader && this.state.buyFees && !hasWarning && <React.Fragment>
                            <div className="align-center">
                                <Checkbox className="buy-agree-terms" checked={this.state.termsChecked} onChange={this.onTermsChange} disabled={!feesAreValid || this.state.pending}>
                                    <span className={feesAreValid && this.state.termsChecked ? 'text-brighter' : 'text-disabled'}>
                                        I have read and agree to the <Link to={URL_TERMS_AND_CONDITIONS} target="_blank" className="link-highlight" title="Open Terms and Conditions in new window">Terms and Conditions</Link> and <Link to={URL_RETURNS_POLICY} target="_blank" className="link-highlight" title="Open Returns Policy in new window">Returns Policy</Link>
                                        <br />
                                        I agree that by clicking '{BUY_BUTTON_TEXT}'
                                        <br/> I am placing my order with an obligation to pay
                                    </span>
                                </Checkbox>
                            </div>
                        
                            <Button id="buyTokens" size={'large'} onClick={this.handleBuyButtonClicked} disabled={this.state.pending || !this.state.termsChecked || !feesAreValid }>
                                {!this.state.pending && <span>{BUY_BUTTON_TEXT}</span>}
                                {this.state.pending && <LoadingIndicator text={this.state.validationPending ? 'Validating' : 'Purchasing'} />}
                            </Button>
                        </React.Fragment> }
                    </div>}
                    {!this.state.pending && isCryptoPayment && <label className={`${this.state.pending ? "unclickable" : "clickable"} payment-options-back`} onClick={this.state.pending ? null : this.resetPaymentOption}> {"<"} Go Back to Payment Options</label>}
                </React.Fragment>}
                <br />
                {unlockWalletWarning && <Alert type="warning" showIcon message={<span>Please <Login unlockButtonText=" unlock your wallet " /> to pay with cryptocurrency</span>} /> }
                {registrationWarning && <Alert type="warning" showIcon message={(isConnectedWithColdWallet ? `Please unlock your ${HOT_WALLET_TEXT} wallet` : <span>Please <Link to={URL_MEMBERSHIP_REGISTRATION}>register as a member</Link> to pay with cryptocurrency</span>)} /> }
                {isCryptoPayment && <React.Fragment>
                    {!isTickerOnline && <Alert type="warning" showIcon message="BITCAR and ETH currency feed is currently offline, purchases are unavailable, there should be more details in the website header bar." /> }
                    {(bitcarTooLowWarning || ethereumTooLowWarning) && <Alert type="warning" showIcon message="You do not have enough BITCAR and/or ETH to buy this many fractions of the car." />}
                    {whitelistWarning && <Alert type="warning" showIcon message={FRIENDLY_ERROR_MESSAGES.WHITELIST_BUY_INVALID.message} />}
                </React.Fragment>}
                { this.state.web3Response && <div style={{marginTop: 10}}>
                    <Web3ResponseHandler web3Response={this.state.web3Response} />
                </div> }
            </Form>
    } 
}
BuyTokens.propTypes = {
};
  
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      web3: state.UIstate.web3,
      currentUser: state.UIstate.currentUser,
      bitcarBalance: state.UserState.bitcarBalance,
      bitcarDisplayBalance: state.UserState.bitcarDisplayBalance,
      etherDisplayBalances: state.UserState.etherDisplayBalances,
      bitcarUsd: state.PlatformEvent.bitcarUsd,
      bitcarUsdDisplay: state.PlatformEvent.bitcarUsdDisplay,
      isTickerOnline: state.PlatformEvent.isTickerOnline,
      ethUsd: state.PlatformEvent.ethUsd
    }
}
export default Form.create()(connect(mapStateToProps)(BuyTokens));

