import React from "react";
import { Alert, Icon, Input, Form } from "antd";
import { connect } from 'react-redux';
import { convertFromSolidityNumber } from '../../util/helpers';
import Fees from "../../classes/Fees";
import * as _ from 'lodash';
import { getMinimumPurchaseQty, isCreditCardPurchaseValid } from '../../core/tokenPurchase';
import BigNumber from "bignumber.js";
import { processError } from "../../util/web3/web3Wrapper";
import CurrencyInfo from "./CurrencyInfo";
import FiatPaymentBreakdown from "./FiatPaymentBreakdown";

// TODO replace min/max with values from contract
const maximumTokenBuy = 30000;

export const validateQty = (qty, asset) => {
    return new Promise(async (resolve, reject) => {
        
        let hasErrored = false;
        await isCreditCardPurchaseValid(asset, qty).catch(web3Response => {
            hasErrored = true;
            reject(web3Response);
        });

        if(hasErrored) {
            console.error('Error whilst validating purchase');
            reject(processError(''));
            return;
        }
        resolve(true);
    });
}

class AdjustPurchase extends React.Component {

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
            minimumPurchaseAmount: this.getMinimumPurchaseQuantity()
        };
    }

    componentDidMount(){
        this.getTotalDue(this.props.purchaseAmount, this.props.asset);
    }

    componentDidUpdate(prevProps) {
        let hasTickerChanged = this.props.asset && (!prevProps.bitcarUsd.isEqualTo(this.props.bitcarUsd) || !prevProps.ethUsd.isEqualTo(this.props.ethUsd));
        if (this.props.isTickerOnline && hasTickerChanged) {
            this.getTotalDue(this.props.form.getFieldValue("qtyToBuy"), this.props.asset);
        }

        if(prevProps.assetBalance.qtyRemaining !== this.props.assetBalance.qtyRemaining) {
            this.setState({minimumPurchaseAmount: this.getMinimumPurchaseQuantity()});
        }
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

        return fees;
    }

    validateBuyQty = (rule, value, callback) => {

        if(this.state.web3Response) {
            this.setState({web3Response: undefined});
        }

        if (value === undefined) {
            callback();
            this.props.isValid(false);
            return;
        }

        const numberValue = new BigNumber(value);

        const minPurchaseAmount = this.state.minimumPurchaseAmount;

        if (numberValue.isNaN() || numberValue.isLessThan(minPurchaseAmount) || numberValue.isGreaterThan(maximumTokenBuy) || (numberValue.mod(1).toString() !== '0') ) {
            this.setFeesToInvalid();
            callback(`Minimum purchase is ${minPurchaseAmount.toFormat(0)}, maximum per transaction is ${maximumTokenBuy}. Whole numbers only.`);
            this.props.isValid(false);
            return;
        }

        // Validation passed so update the form
        this.setState({tokenQtyValid: true});
        this.getTotalDue(value, this.props.asset).then(newFees => {
            this.props.qtyChanged(newFees);
        });

        this.props.isValid(true);

        callback();
    }

    setFeesToInvalid = () => {
        let fees = new Fees(new BigNumber(0), this.props.asset.pafPerToken, this.props.asset.escrowPerToken, this.props.asset.ptfPerToken, this.props.bitcarUsd, this.props.ethUsd, this.props.asset.tokenBitCarPercent, this.props.asset.tokenEthereumPercent, this.props.asset.requiresEth);
        this.setState({tokenQtyValid: false, buyFees: fees, percentToBuy: 0});
    }

    toggleBreakdown = () => {
        this.setState({ breakdownShown: !this.state.breakdownShown })
    }

    render() {
        const loadedAsset = this.props.asset;
        const { getFieldDecorator } = this.props.form;

        const isTickerOnline = this.props.isTickerOnline;
        const addOnAfterTokenField = "fractions";

        return <Form>
                {isTickerOnline && <React.Fragment>
                    <Form.Item name="qtyToBuy" label="I am buying:" style={{marginBottom: 0}}>
                        {getFieldDecorator('qtyToBuy', { rules: [{ required: true, message: 'Please enter amount to buy...' }, 
                        {validator: this.validateBuyQty}], initialValue: this.props.purchaseAmount })(
                        //TODO:this.props.loadedAsset.availableTokens
                        <Input type="number" placeholder="Enter amount..." id="qtyToBuy" addonAfter={addOnAfterTokenField} disabled={this.state.pending} min={this.state.minimumPurchaseAmount} max={maximumTokenBuy} />
                        )}
                    </Form.Item>
                    {this.state.buyFees && <span>
                        <h1 className="text-header-font header-total">
                            <CurrencyInfo totalUsd={this.state.buyFees && this.state.buyFees.totalUsd_display}>Total Purchase Cost: USD ${this.state.buyFees.totalUsd_display} <Icon type="question-circle" />
                            </CurrencyInfo>
                        </h1>
                        <div className="align-center">
                            {/* <Row>
                            <PriceBubble header="Amount Due in USD" amountToPay={this.state.buyFees.totalUsd_display} image={<Icon type="dollar" />}/>
                            </Row> */}
                        </div>
                        {/* <div className="font-14" style={{marginTop: 5}}>Based on exchange rates of 1 BitCar = USD ${this.props.bitcarUsdDisplay}{ loadedAsset.requiresEth && `, 1 Eth = USD $${this.props.ethUsd.toFormat(DISPLAY_DECIMALS_USD)}`}
                        </div> */}
                        <div onClick={this.toggleBreakdown} className="link-highlight payment-breakdown-link">
                            { this.state.breakdownShown ? 'Hide' : 'Show' } payment breakdown
                        </div>
                        { this.state.breakdownShown && <div>
                            <hr />
                            <FiatPaymentBreakdown hotWallet={this.props.currentUser ? this.props.currentUser.hotWallet : null} loadedAsset={loadedAsset} displayTokenBitCarCost={this.state.buyFees.displayTokenBitCarCost} 
                                displayTotalEthereum={this.state.buyFees.displayTotalEthereum} displayTokenQty={this.state.buyFees.tokenQty.toFormat(0)} 
                                displayBEE={this.state.buyFees.displayBEE} displayBEEinUSD={this.state.buyFees.displayBEEinUSD} 
                                // displayPAF={this.state.buyFees.displayPAF} displayPAFinUSD={this.state.buyFees.displayPAFinUSD}
                                // displayPTF={this.state.buyFees.displayPTF} displayPTFinUSD={this.state.buyFees.displayPTFinUSD}
                                />
                            <hr />
                        </div> }

                    </span> }
                </React.Fragment>}
                <br />
                {!isTickerOnline && <Alert type="warning" showIcon message="BITCAR and ETH currency feed is currently offline, purchases are unavailable, there should be more details in the website header bar." /> }
                {/* {unlockWalletWarning && <Alert type="warning" showIcon message="Please unlock your wallet to continue" /> } */}
                {/* {registrationWarning && <Alert type="warning" showIcon message={(isConnectedWithColdWallet ? `Please unlock your ${HOT_WALLET_TEXT} wallet` : "Please register as a member") + " to continue"} /> } */}
                {/* {(bitcarTooLowWarning || ethereumTooLowWarning) && <Alert type="warning" showIcon message="You do not have enough BITCAR and/or ETH to buy this many fractions of the car." />} */}
                {/* {whitelistWarning && <Alert type="warning" showIcon message={FRIENDLY_ERROR_MESSAGES.WHITELIST_BUY_INVALID.message} />}
                { this.state.web3Response && <div style={{marginTop: 10}}>
                    <Web3ResponseHandler web3Response={this.state.web3Response} successMessage={`You have successfully purchased ${this.state.purchasedQty} fractions of the car.`} />
                </div> } */}
            </Form>
    } 
}
AdjustPurchase.propTypes = {
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
      ethUsd: state.PlatformEvent.ethUsd,
      isUsingPaypal: state.CreditCardPayment.isUsingPaypal
    }
}
export default Form.create()(connect(mapStateToProps)(AdjustPurchase));

