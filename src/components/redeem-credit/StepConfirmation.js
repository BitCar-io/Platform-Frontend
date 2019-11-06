import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Col, Button, Alert, Row } from 'antd';

import Axios from "axios";
import { URL_DASHBOARD } from '../../util/platformNavigation';
import LoadingIndicator from '../LoadingIndicator';
import { BITCAR_ENTITY } from '../../util/globalVariables';
import { Link } from 'react-router-dom';

class StepConfirmation extends React.Component {

    constructor(props) {
        super(props);

        const redemptionData = this.props.getRedeemData();

        this.state = {
            redemptionData: redemptionData,
            isComplete: false,
            isPending: false,
            status: null
        };
    }

    setStatus(title, message, type, otherState) {
        this.setState({...otherState, 
            status: {
                title: title,
                message: message,
                type: type
            }
        })
    }

    confirm = () => {

        this.setState({isPending: true});

        const personalInfo = this.state.redemptionData;

        Axios.post(`${process.env.SIDS_API_URL}code/redeem`, {
            code: personalInfo.code,
            dob: personalInfo.kycData.dob,
            documentID: personalInfo.kycData.id
        })
        .then(result => {
            this.setStatus("Code has been successfully redeemed", <span>Please allow up to 30 days for the tokens to be received into your trading wallet address shown above. Once received, you can view your tokens in <Link to={URL_DASHBOARD}>'My Garage'</Link></span>, "success", {isComplete: true});
        })
        .catch(error => {
            console.error(error);
            this.setStatus("Unable to validate code", error.response.data.result, "error", {isPending: false});
        })
    }

    prev = () => {
        // go back two as we want to go back to the Redemption details screen
        this.props.setCurrentStep(this.props.getCurrentStep() - 2);
    }

    render() {
        const personalInfo = this.state.redemptionData;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        return (
            <Row>
                {personalInfo.isRedeemed && <Col>
                    <Alert className="already-redeemed" message={<span>This redemption code has already been redeemed, if you believe this to be an error please contact us at <a className="email-bitcar" href={`mailto:${BITCAR_ENTITY.contactEmail}?subject=Redemption Code Already Redeemed&body=Redemption Code:${personalInfo.code}`}>{BITCAR_ENTITY.contactEmail}</a></span>} showIcon type="error" />
                </Col>}
                <Col>
                    <Form.Item label={'Redemption Code'}>
                        {getFieldDecorator('inputOrderID', {initialValue: personalInfo.code})(
                            <Input disabled={true}/>
                        )}
                    </Form.Item>

                    {!personalInfo.isRedeemed && <Form.Item label={'BitCar Registered Trading Address'}>
                        {getFieldDecorator('tradingAddress', {initialValue: this.props.coinbase})(
                            <Input disabled={true}/>
                        )}
                    </Form.Item>}

                    <Form.Item label={'Tokens Purchased'}>
                        {getFieldDecorator('tokenAmount', {initialValue: personalInfo.paymentData.qty})(
                            <Input disabled={true}/>
                        )}
                    </Form.Item>

                    <Form.Item label={`Purchase Price (in ${personalInfo.paymentData.currency})`}>
                        {getFieldDecorator('fiatAmount', {initialValue: personalInfo.paymentData.amount})(
                            <Input disabled={true}/>
                        )}
                    </Form.Item>

                    {this.state.status && 
                        <Alert
                            className="redemption-alert"
                            message={this.state.status.title}
                            description={this.state.status.message}
                            type={this.state.status.type}
                            closable
                            onClose={this.state.status = null}
                        />
                    }

                    {<Col sm={24} md={12} lg={24} xl={24}>
                        <div className="steps-action">
                            {!this.state.isComplete && !personalInfo.isRedeemed && <Button className="step-next-btn" size={'large'} type="primary" onClick={this.confirm} disabled={this.state.isPending}>
                                {(this.state.isPending && <LoadingIndicator text="Verifying" />) || "Redeem"}
                            </Button>}
                            <Button className="step-previous-btn" size={'large'} onClick={this.prev} disabled={this.state.isPending}>
                                Change Code
                            </Button>
                        </div>
                    </Col>}
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3,
        web3Status: state.UIstate.web3Status,
        connectedNetwork: state.UIstate.connectedNetwork,
        assetContracts: state.AssetState.assetContracts,
        coinbase: state.UIstate.coinbase,
        platformErrorMessage: state.UIstate.platformErrorMessage
    }
}

export default Form.create()(connect(mapStateToProps)(StepConfirmation));