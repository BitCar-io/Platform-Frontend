import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Steps, Button, message } from 'antd';

import StepPreliminaryChecks from './StepPreliminaryChecks'
import StepRedeemDetails from './StepRedeemDetails'
import StepRegistration from './StepRegistration'
import StepConfirmation from './StepConfirmation'

import RedeemDataValidator from './RedeemDataValidator'

const { Step } = Steps;

const confirmationStep = 3;

class RedeemContainer extends React.Component {
    state = {
        current: 0,
        redeemData: {
            name: "",
            dob: "",
            nationalities: "",
            countryOfResidence: "",
            pob: "",
            occupation: "",
            address: "",
            taxAddress: "",
            email: "",
            id: "",
            idType: "",
            code: "",
            documentID: ""
        }
    };

    setCurrentStepCallback = (step) => {

        let newStep = step;

        if(this.state.current !== confirmationStep && this.state.redeemData && this.state.redeemData.isRedeemed) {
            newStep = confirmationStep
        }

        this.setState({current: newStep});
    }

    getCurrentStepCallback = () => {
        return this.state.current;
    }

    setRedeemDataCallback = (data) => {
        const redeemDataValidator = RedeemDataValidator(data);

        if(redeemDataValidator.error) {
            return redeemDataValidator.error;
        }

        this.setState({redeemData: data});
    }

    getRedeemDataCallback = () => {
        return this.state.redeemData;
    }
    
    steps = [
        {
            title: 'Preliminary checks',
            content: 
                <StepPreliminaryChecks 
                    setCurrentStep={this.setCurrentStepCallback}
                    getCurrentStep={this.getCurrentStepCallback}
                />,
        },
        {
            title: 'Redemption details',
            content: 
            <StepRedeemDetails
                setRedeemData={this.setRedeemDataCallback} 
                getRedeemData={this.getRedeemDataCallback} 
                setCurrentStep={this.setCurrentStepCallback} 
                getCurrentStep={this.getCurrentStepCallback}
            />,
        },
        {
            title: 'Platform registration',
            content: <StepRegistration
                setRedeemData={this.setRedeemDataCallback} 
                getRedeemData={this.getRedeemDataCallback} 
                setCurrentStep={this.setCurrentStepCallback} 
                getCurrentStep={this.getCurrentStepCallback}
            />
        },
        {
            title: 'Confirmation',
            content: <StepConfirmation 
                getRedeemData={this.getRedeemDataCallback}
                setCurrentStep={this.setCurrentStepCallback} 
                getCurrentStep={this.getCurrentStepCallback}
            />,
        },
    ];

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevprops) {
        if(prevprops.coinbase !== this.props.coinbase || prevprops.connectedNetwork !== this.props.connectedNetwork) {
            this.setCurrentStepCallback(0);
        }
    }

    render() {
        const { current } = this.state;

        return (
            <Card className="dash-stat-card car-info-card redeem-steps-container">
                <Steps size="small" current={current} status={this.state.redeemData.isRedeemed && this.state.current === confirmationStep ? 'error' : undefined}>
                {this.steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
                </Steps>
                <div className="steps-content">{this.steps[current].content}</div>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        connectedNetwork: state.UIstate.connectedNetwork,
        coinbase: state.UIstate.coinbase
    }
}

export default connect(mapStateToProps)(RedeemContainer);