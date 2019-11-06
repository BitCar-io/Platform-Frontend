import React from "react";
import store from '../../store';
import { connect } from 'react-redux';
import Script from 'react-load-script'
import { Form, Alert } from "antd";
import * as _ from 'lodash';
import {Helmet} from "react-helmet";

import { convertUserDataToPaypalPayee, createPaypalPurchaseUnits, paypalApplicationContext, paypalStatuses, generateReceiptData } from "../../util/fiat/paypal";
import { setCreditCardPaymentComplete, setCreditCardPaymentPending } from "../../actions";
import Axios from "axios";
import LoadingIndicator from "../LoadingIndicator";

class PayPalPaymentProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scriptLoaded: false,
            error: undefined,
            transactionState: undefined,
            paypalButton: undefined
        }
    }

    componentDidMount() {
        this.renderPaypalButton();
    }

    componentDidUpdate(prevprops, prevstate) {
        if(prevstate.scriptLoaded !== this.state.scriptLoaded && this.state.scriptLoaded) {
            this.renderPaypalButton();
        }
    }

    paypalOnInit = (data, actions) => {
        if(!this.props.enablePurchase) {
            actions.disable();
        }
        
        this.props.runOnEnable((enableButtons) => {

            // console.log('runOnEnable');
            if(enableButtons) {
                actions.enable();
                return;
            }

            actions.disable();
        });
    }

    renderPaypalButton = () => {

        let paypal = this.state.scriptLoaded && this.props.userFiatToken && window.paypal && window.paypal.Buttons({

            onInit: this.paypalOnInit,
            onClick: this.props.paypalOnClick,

            createOrder: this.createOrder,
            onApprove: this.onApprove,
            onCancel: this.onCancel,
            onError: this.onError,
            style: {
                color: 'gold',
                size: 'responsive',
                shape: 'pill',
                label: 'pay',
                fundingicons : 'true'
            }
        });

        if(paypal) {
            paypal.render('#paypal-button-container');
        }
    }

    scriptLoaded = () => {
        this.setState({scriptLoaded: true});
    }

    scriptFailed = () => {
        // console.log('script failed');
        this.setState({scriptLoaded: false});
    }

    createOrder = (data, actions) => {

        this.setTransactionState(paypalStatuses.pending);

        const user = this.props.purchasingUser;

        const paypalPayer = convertUserDataToPaypalPayee(user);
        const paypalPurchaseUnits = createPaypalPurchaseUnits(this.props.purchaseFees, this.props.assetToPurchase, this.props.userFiatToken);

        return actions.order.create({
            intent: "CAPTURE",
            payer: paypalPayer,
            purchase_units: paypalPurchaseUnits,
            application_context: paypalApplicationContext()
        })
    }

    onApprove = (data, actions) => {

        const that = this;

        return actions.order.capture().then(function(details) {

            that.setTransactionState(paypalStatuses.success);

            const receiptData = generateReceiptData(details, that.props.purchasingUser);

            that.paypalPayment(that.props.userFiatToken, receiptData);

            store.dispatch(setCreditCardPaymentComplete(receiptData.redemption_code));
        });
    }

    paypalPayment = (userToken, paypalPayload) => {
        Axios.post(`${process.env.SIDS_API_URL}payment/request`, {
            userToken: userToken,
            data: paypalPayload
        })
        .then(result => {
            console.log('CreateCode Result', result);
        })
        .catch(error => {
            console.log('CreateCode Error', error);
        })
    }
    
    getReceiptDetails = (access_token, orderId) => {
        console.log('access_token', access_token);
        console.log('orderId', orderId);

        return Axios.get(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
            headers: {
                Accept:        `application/json`,
                Authorization: `Bearer ${ access_token }`
            }
        });
    }

    onCancel = (data) => {
        this.setTransactionState(paypalStatuses.userCancelled);
    }
    
    onError = (err) => {
        console.log('onError', err);
        this.setTransactionState(paypalStatuses.error);
    }

    setTransactionState = (transactionState) => {
        console.log('setTransactionState called', transactionState);
        store.dispatch(setCreditCardPaymentPending(transactionState === paypalStatuses.pending));
        this.setState({transactionState: transactionState});
    }

    render() {

        let error = this.state.error;

        return <div id="paypal-payment-container">
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            </Helmet>
            {!this.state.scriptLoaded && <LoadingIndicator />}
            <Script url={`${process.env.PAYPAL_PAYMENT_URL}?client-id=${process.env.PAYPAL_CLIENTID}`} onLoad={this.scriptLoaded} onError={this.scriptFailed} />
            {this.state.transactionState === paypalStatuses.rejected && <div className="card-payment-rejected">
                Your previous purchase attempt was unsuccessful - your payment attempt was rejected by PayPal, please check your details and try again.
            </div>}
            {this.state.transactionState === paypalStatuses.userCancelled && <div className="card-payment-rejected">
                Your previous purchase attempt was unsuccessful - your payment attempt was cancelled before it was completed, please try again.
            </div>}
            {this.state.transactionState === paypalStatuses.error && <div className="card-payment-rejected">
                Your previous purchase attempt was unsuccessful - your payment attempt did not succeed due to an error with the PayPal system. Please try again or contact PayPal for assistance.
            </div>}
            <div id="paypal-button-container" />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        customerAmlDetails: state.CreditCardPayment.customerAmlDetails,
        customerDetails: state.CreditCardPayment.customerDetails,
        fiatPaymentToken: state.CreditCardPayment.fiatPaymentToken,
        paymentRejected: state.CreditCardPayment.paymentRejected,
        purchaseFees: state.CreditCardPayment.purchaseFees,
        assetToPurchase: state.CreditCardPayment.assetToPurchase,
        steps: state.CreditCardPayment.steps,
        userFiatToken: state.CreditCardPayment.userFiatToken,
        purchasingUser: state.CreditCardPayment.purchasingUser
    }
}

export default Form.create()(connect(mapStateToProps)(PayPalPaymentProvider));
