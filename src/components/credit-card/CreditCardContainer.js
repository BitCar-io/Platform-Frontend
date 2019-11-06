import React from "react";
import store from '../../store';
import { connect } from 'react-redux';
import LoadingComponent from "../LoadingComponent";
import { Form, Steps, Button, Card } from "antd";
import * as _ from 'lodash';
import { setCreditCardSteps, updateCurrentCreditCardStep, updateCustomerDetails } from "../../actions";
import BasicPersonalInfo from "./BasicPersonalInfo";
import AdvancedPersonalInfo from "./AdvancedPersonalInfo";
import { scrollToTop } from "../../util/helpers";
import DetailConfirmation from "./DetailConfirmation";
import { Redirect } from "react-router";
import { URL_HOME } from "../../util/platformNavigation";
import CreditCardReceipt from "./CreditCardReceipt";
import PaymentConfirmationContainer from "./PaymentConfirmationContainer";
import FiatInformation from "./FiatInformation";
import AgreeToPurchaseTerms from "./AgreeToPurchaseTerms";

const { Step } = Steps;

class CreditCardContainer extends React.Component {

    constructor(props) {
        super(props);
        const steps = [
            {
                title: 'Information',
                icon: <i className="fas fa-info" />
            },
            {
                title: 'Customer Details',
                icon: <i className="fas fa-address-card" />
            },
            {
                title: 'AML Details',
                icon: <i className="fas fa-user-shield" />
            },
            {
                title: 'Confirm Details',
                icon: <i className="fas fa-user-check" />
            },
            {
                title: 'Payment',
                icon: props.isUsingPaypal ? <i className="fab fa-cc-paypal" /> : <i className="fas fa-shopping-cart" />
            }
        ];

        let initialStep = this.props.purchaseFees ? 1 : 0;
        
        store.dispatch(setCreditCardSteps(steps, 0));

        this.state = {
            childForms: {},
            currentForm: undefined,
            isContinueVisible: true,
            isBackVisible: true
        }
    }

    // // TODO: REMOVE TESTING ONLY
    // componentDidUpdate(prevprops) {

    //     if(this.props.loadedAssets && this.props.loadedAssets !== prevprops.loadedAssets) {
    //         // store.dispatch(updateCurrentCreditCardStep(2));
    //         store.dispatch(setCreditCardBuyNow(this.props.purchaseFees, this.props.loadedAssets[process.env.DEPLOYED_ASSET_ADDRESS]));
            
    //         const user = generateMembershipDataFromProps(this.props.customerDetails, this.props.customerAmlDetails);
    //         store.dispatch(setUserFiatToken('user-38t34965728963789452386', user));
    //     }

    //     if(this.props.purchasingUser !== prevprops.purchasingUser) {
    //         // store.dispatch(updateCurrentCreditCardStep(3));
    //         // console.log('disatcher3')
    //         // store.dispatch(setCreditCardPaymentComplete('03H08600SH637990C'));
    //     }
    // }
    // // END OF TESTING

    componentWillUnmount() {
        store.dispatch(setCreditCardSteps(undefined));
    }
    
    nextStep = (e) => {

        e.preventDefault();

        if(!this.validateInput()) {
            return;
        }

        this.goToNextStep();
    }

    goToNextStep = () => {
        store.dispatch(updateCurrentCreditCardStep(this.props.currentStep + 1));
        scrollToTop();
    }

    previousStep = () => {
        scrollToTop();
        store.dispatch(updateCurrentCreditCardStep(this.props.currentStep - 1));
        this.setState({isContinueVisible: true});
    }

    advancedDataChanged = (changedFields) => {

        let currentDetails = Object.assign({}, this.props.customerAmlDetails);
        
        store.dispatch(updateCustomerDetails(true, { ...currentDetails, ...changedFields }));
    }

    personalDataChanged = (changedFields) => {

        let currentDetails = Object.assign({}, this.props.customerDetails);
        
        store.dispatch(updateCustomerDetails(false, { ...currentDetails, ...changedFields }));
    }

    setIsContinueVisible = (isVisible) => {
        this.setState({isContinueVisible: isVisible});
    }

    mountForm = (form) => {
        this.setState({currentForm: form});
    }

    unmountForm = () => {
        this.setState({currentForm: undefined});
    }

    validateInput = () => {

        let isValid = true;

        if(this.state.currentForm) {
            this.state.currentForm.validateFields((errors, values) => {
                isValid = isValid && !errors;
            });
        }

        return isValid;
    }

    render() {

        if (!this.props.loadedAssets) {
            return <LoadingComponent image={require('../../logos/logo_bitcar.png')} text="Loading Application Data, Please Wait" />
        }

        if(!this.props.assetToPurchase || !this.props.purchaseFees) {
            return <Redirect to={URL_HOME} />
        }

        const steps = this.props.steps;

        if(!steps) {
            return "ERROR";
        }

        const infoStep = 0;
        const basicInfoStep = 1;
        const amlStep = 2
        const confirmationStep = 3;
        const paymentStep = 4;
        const currentStep = this.props.currentStep;

        const stepDisplay = <Steps size="small" current={currentStep} className="credit-card-steps">
            {steps.map((item, index) => (
                <Step key={index} title={item.title} icon={item.icon} />
            ))}
        </Steps>;

        if(this.props.paymentSuccessful) {
            scrollToTop();
            return <Card className="dash-stat-card car-info-card">
                <CreditCardReceipt orderId={this.props.redemptionCode} redemptionCode={this.props.redemptionCode} user={this.props.purchasingUser} asset={this.props.assetToPurchase} purchase={this.props.purchaseFees} isUsingPaypal={this.props.isUsingPaypal}  />
            </Card>
        }

        if(currentStep === paymentStep) {
            return <div className="fiat-steps-container">
                    <Card className="dash-stat-card car-info-card" size={'small'}>
                        {stepDisplay}
                        <PaymentConfirmationContainer />
                    </Card>
            </div>;
        }

        return (
            <Card className="dash-stat-card car-info-card">
                <div className="fiat-steps-container">
                    {stepDisplay}
                    {currentStep !== paymentStep && <Form layout={currentStep === confirmationStep ? "vertical" : undefined}>
                        {currentStep === infoStep && <React.Fragment>
                                <FiatInformation />
                            </React.Fragment>}
                        {currentStep === basicInfoStep && <BasicPersonalInfo fields={{...this.props.customerDetails}} onChange={this.personalDataChanged} mountForm={this.mountForm} unmountForm={this.unmountForm} enableEmailConfirmation={true} />}
                        {currentStep === amlStep && <AdvancedPersonalInfo fields={{...this.props.customerAmlDetails}} onChange={this.advancedDataChanged} mountForm={this.mountForm} unmountForm={this.unmountForm} />}
                        {currentStep === confirmationStep && <DetailConfirmation setIsContinueVisible={this.setIsContinueVisible} validate={this.props.onValidation} onBuyClick={this.goToNextStep} />}
                        {this.state.isBackVisible && <Button className="step-previous-btn" id=" back" size={'large'} onClick={this.previousStep} disabled={currentStep === 0}>Go Back</Button>}
                        {this.state.isContinueVisible && <Button className="step-next-btn" size={'large'} onClick={this.nextStep}>Continue</Button>}
                    </Form>}
                </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loadedAssets: state.AssetState.loadedAssets,
        assetToPurchase: state.CreditCardPayment.assetToPurchase,
        currentStep: state.CreditCardPayment.currentStep,
        customerAmlDetails: state.CreditCardPayment.customerAmlDetails,
        customerDetails: state.CreditCardPayment.customerDetails,
        purchasingUser: state.CreditCardPayment.purchasingUser,
        purchaseFees: state.CreditCardPayment.purchaseFees,
        steps: state.CreditCardPayment.steps,
        paymentSuccessful: state.CreditCardPayment.paymentSuccessful,
        redemptionCode: state.CreditCardPayment.redemptionCode,
        isUsingPaypal: state.CreditCardPayment.isUsingPaypal
    }
}

export default Form.create()(connect(mapStateToProps)(CreditCardContainer));