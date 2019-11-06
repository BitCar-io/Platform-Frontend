import React from "react";
import { Row, Col, Card, Modal } from "antd";
import { connect } from 'react-redux';
import * as _ from 'lodash';
import AgreeToPurchaseTerms from "./AgreeToPurchaseTerms";
import { updateCreditCardPurchase } from "../../actions";
import store from "../../store";
import LoadingIndicator from "../LoadingIndicator";
import AdjustPurchase, { validateQty } from "./AdjustPurchase";
import PayPalPaymentProvider from "./PayPalPaymentProvider";
import { ipfsUrl } from "../../util/helpers";
import Web3ResponseHandler from "../Web3ResponseHandler";
import FiatPaymentBreakdown from "./FiatPaymentBreakdown";

// TODO replace min/max with values from contract

class PaymentConfirmationContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            termsChecked: false,
            isAmountValid: true,
            isPending: false,
            error: false,
            enablePaymentButtons: undefined,
            paypalClicked: false,
            prePaymentCheck: undefined,
            web3Response: undefined,
            validationError: undefined
        }
    }

    componentDidMount() {
        this.enablePayment(false);
    }

    isAmountValid = (isValid) => {
        this.enablePayment(isValid && this.state.termsChecked);
        this.setState({isAmountValid: isValid});
    }

    onTermsChange = () => {

        const canContinue = !this.state.termsChecked;

        this.enablePayment(canContinue && this.state.isAmountValid);
        this.setState({termsChecked: canContinue, paypalClicked: false});
    }

    enablePayment = (isTrue) => {
        const enablePaymentButtons = this.state.enablePaymentButtons;

        if(!enablePaymentButtons) {
            return;
        }

        enablePaymentButtons(isTrue);
    }

    buyConfirmed = (e) => {
        e.preventDefault();

        if(!this.props.validate()) {
            return;
        }

        this.createUser();
    }

    setPrePaymentCheck(prePaymentCheckFunction) {
        this.setState({prePaymentCheck: prePaymentCheckFunction})
    }

    paypalEnableButtons = (functionToRun) => {
        this.setState({enablePaymentButtons: functionToRun});
    }

    qtyChanged = (newFees) => {
        store.dispatch(updateCreditCardPurchase(newFees));
    }

    paypalOnClick = (data, actions) => {
        // console.log('Paypal clicked');

        this.setState({paypalClicked: true});

        if(!this.state.termsChecked || !this.state.isAmountValid) {
            return;
        }

        return validateQty(this.props.purchaseFees.tokenQty, this.props.assetToPurchase).then(result => {
            return actions.resolve();
        }).catch(error => {
            const isWeb3ResponseError = (typeof error === 'Web3Response');

            this.setState({validationError: !isWeb3ResponseError && error, web3Response: isWeb3ResponseError && error});
            return actions.reject();
        });
    }

    render() {
        const asset = this.props.assetToPurchase;
        const assetTitle = `${asset.data.make} ${asset.data.model} (${asset.tokenCode})`;
        const purchase = this.props.purchaseFees;

        const assetBalance = this.props.assetBalances[asset.address];
        const purchaseQty = purchase.tokenQty.toFormat(0);

        return (
            <Row>
                <Card className="dash-stat-card car-info-card" size="small">
                    <Row>
                        <Col sm={24} md={12} lg={12} xl={12} xxl={8} className="confirm-purchase">
                            <h1 className="font-18">{assetTitle}</h1>
                            <AdjustPurchase setPrePaymentCheck={this.setPrePaymentCheck} isValid={this.isAmountValid} asset={asset} assetBalance={assetBalance} purchaseAmount={purchaseQty} qtyChanged={this.qtyChanged}  />
                        </Col>
                        <Col sm={0} md={12} lg={12} xl={12} xxl={8} className="confirm-purchase-breakdown">
                            <FiatPaymentBreakdown loadedAsset={asset} displayTokenBitCarCost={purchase.displayTokenBitCarCost} 
                                    displayTotalEthereum={purchase.displayTotalEthereum} displayTokenQty={purchaseQty}
                                    displayBEE={purchase.displayBEE} displayBEEinUSD={purchase.displayBEEinUSD} 
                                    // displayPAF={purchase.displayPAF} displayPAFinUSD={purchase.displayPAFinUSD}
                                    // displayPTF={purchase.displayPTF} displayPTFinUSD={purchase.displayPTFinUSD}
                                    />
                        </Col>
                        <Col sm={0} md={0} lg={0} xl={0} xxl={8} className="confirm-purchase-car">
                            <img src={ipfsUrl + asset.data.garageImage } alt='' />
                        </Col>
                    </Row>
                </Card>
                <Card className="dash-stat-card car-info-card" size="small">
                    <Row>
                        <Col className="purchase-agree-terms">
                        <AgreeToPurchaseTerms className="step-terms-box" termsChecked={this.state.termsChecked} onCheckedChange={this.onTermsChange} buttonTextOverride={"Pay with PayPal"} />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={24}>
                            {this.state.paypalClicked && !this.state.termsChecked && <div className='purchase-validation-error'>
                                You must indicate you agree with the terms and conditions to continue
                            </div>}
                            {!this.state.isAmountValid && <div className='purchase-validation-error'>
                                You must enter a valid number of fractions to buy
                            </div>}
                            <PayPalPaymentProvider runOnEnable={this.paypalEnableButtons} paypalOnClick={this.paypalOnClick} enablePurchase={this.state.termsChecked} />
                            {this.state.validationError &&
                                <Web3ResponseHandler web3Response={this.state.validationError} />
                            }
                        </Col>
                    </Row>
                </Card>

                <Modal visible={this.props.purchasePending} centered closable={false} footer={null} >
                    <div className="membership-progress">
                        <h2>Processing Payment, please wait...</h2>
                    </div>
                    <div className="align-center">
                        <LoadingIndicator text={' '} size={40} />
                    </div>
                </Modal>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loadedAssets: state.AssetState.loadedAssets,
        assetBalances: state.PlatformEvent.assetBalances,
        assetToPurchase: state.CreditCardPayment.assetToPurchase,
        customerAmlDetails: state.CreditCardPayment.customerAmlDetails,
        customerDetails: state.CreditCardPayment.customerDetails,
        purchaseFees: state.CreditCardPayment.purchaseFees,
        steps: state.CreditCardPayment.steps,
        bitcarUsd: state.PlatformEvent.bitcarUsd,
        isTickerOnline: state.PlatformEvent.isTickerOnline,
        purchasePending: state.CreditCardPayment.purchasePending,
    }
}
export default connect(mapStateToProps)(PaymentConfirmationContainer);
