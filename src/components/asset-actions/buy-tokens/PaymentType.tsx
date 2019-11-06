import React from 'react';
import { Col, Row, Button } from 'antd';

// @ts-ignore
import Img from 'react-image'

interface IPaymentTypeProps {
    isCryptoEnabled:boolean;
    isDisabled:boolean;
    onPaymentTypeChange:((paymentType:PaymentTypeValue) => void);
    onPayPalButtonClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void);
    bitcarBadge: string;
    ethereumBadge: string;
    isEthereumRequired: boolean;
}

export enum PaymentTypeValue {
    CRYPTOCURRENCY,
    PAYPAL
}

class PaymentType extends React.Component<IPaymentTypeProps, null> {

    onCryptoClick = () => {
        this.props.onPaymentTypeChange(PaymentTypeValue.CRYPTOCURRENCY);
    }

    onPayPalClick = (e:React.MouseEvent<HTMLElement, MouseEvent>) => {
        this.props.onPaymentTypeChange(PaymentTypeValue.PAYPAL);
        this.props.onPayPalButtonClick(e);
    }

    render() {

        const props = this.props;

        const paypalAlt = "Pay using PayPal, MasterCard, Visa or Amex";
        const paypalAltElement = <div className="paypal-placeholder">
            <div className="placeholder-text">Pay using</div>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-amex"></i>
        </div>;

        return <div className="payment-types">
        Please select how you wish to pay:
            <Row gutter={4}>
                <Col xs={24} sm={12} title="Pay using Cryptocurrency (will need to be registered and have wallet unlocked)">
                    <Button disabled={!props.isCryptoEnabled || props.isDisabled} onClick={this.onCryptoClick} className={`payment-option${props.isDisabled || !props.isCryptoEnabled ? " disabled" : ""}`}>
                        <div className="payment-container">
                            <img src={props.bitcarBadge} width={40} alt="BitCar Badge" /> BITCAR
                            {props.isEthereumRequired && <span> + </span>}
                            {props.isEthereumRequired && <React.Fragment>{<i className={`${props.ethereumBadge} eth-icon`} />} ETHEREUM</React.Fragment>}
                        </div>
                    </Button>
                </Col>
                <Col xs={24} sm={12} title={paypalAlt}>
                    <Button disabled={props.isDisabled} onClick={this.onPayPalClick} className={`payment-option${props.isDisabled ? " disabled" : ""}`}>
                        <div className="payment-container">
                            
                            <Img src="https://www.paypalobjects.com/webstatic/mktg/logo/PP_AcceptanceMarkTray-NoDiscover_243x40.png" loader={paypalAltElement}  unloader={paypalAltElement} />
                        </div>
                    </Button>
                </Col>
            </Row>
    </div>
    }
}

export default PaymentType;