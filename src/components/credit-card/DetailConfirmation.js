import React from "react";
import { Row, Col, Card, Button, Alert } from "antd";
import { connect } from 'react-redux';
import * as _ from 'lodash';
import AgreeToPurchaseTerms from "./AgreeToPurchaseTerms";
import BasicPersonalInfo from "./BasicPersonalInfo";
import AdvancedPersonalInfo from "./AdvancedPersonalInfo";
import { generateMembershipDataFromProps, createCreditCardUser } from "../../core/fiatPayment";
import { setUserFiatToken } from "../../actions";
import store from "../../store";
import LoadingIndicator from "../LoadingIndicator";
import PortfolioCard from "./PortfolioCard";
import AdjustPurchase from "./AdjustPurchase";

// TODO replace min/max with values from contract

class DetailConfirmation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            termsChecked: false,
            isPending: false,
            error: false
        }
    }

    componentDidMount() {
        this.props.setIsContinueVisible(false);
    }

    onTermsChange = () => {

        const canContinue = !this.state.termsChecked;

        this.setState({termsChecked: canContinue});
    }

    buyConfirmed = (e) => {
        e.preventDefault();

        if(!this.props.validate()) {
            return;
        }

        this.createUser();
    }

    createUser = () => {

        this.setState({isPending: true, error: undefined});

        if(this.props.userToken) {
            this.props.onBuyClick();
            return;
        }

        this.setState({creatingUser: true});

        const user = generateMembershipDataFromProps(this.props.customerDetails, this.props.customerAmlDetails);

        createCreditCardUser(user).then(response => {
            console.log('Create User Response', response);

            const userFiatToken = response.data && response.data.result && response.data.result.userToken;

            if(!userFiatToken) {
                this.setState({error: "no User Token"});
                return;
            }

            store.dispatch(setUserFiatToken(userFiatToken, user));
            this.props.onBuyClick();
        }).catch(error => {
            this.setState({error: error});
            console.error('Error creating user on call', error);
        });
    }

    render() {
        if(this.state.creatingUser) {
            const error = this.state.error;

            return <div id="creating-user">
                <span>
                    <h2>Creating User Account</h2>
                    {!error && <p>Please wait while we create your user account on our system.</p>}
                    {error &&<p>There was an error whilst trying to create your user account, please check your internet connection and <span className="contact-link" onClick={this.createUser}>click here to try again</span> or contact BitCar for support via Telegram or Email</p>}
                </span>
                {!error && <div className="align-center">
                    <LoadingIndicator text={' '} size={40} />
                </div>}
            </div>;
        }

        const confirmationMessage = <strong>Please review the data below and confirm it is correct, you can go back to edit anything if required.<br />You will require some of this information to verify your code after purchasing - so it is crucial this is valid.</strong>

        return (
            <Row>
                <Alert type="warning" message={confirmationMessage} />
                <Card className="dash-stat-card car-info-card confirmation-card" size="small" title={this.props.steps[0].title}>
                    <BasicPersonalInfo fields={{...this.props.customerDetails}} onChange={this.personalDataChanged} enableEmailConfirmation={false} isReadOnly={true} />
                </Card>
                <Card className="dash-stat-card car-info-card confirmation-card" size="small" title={this.props.steps[1].title}>
                    <AdvancedPersonalInfo fields={{...this.props.customerAmlDetails}} isReadOnly={true} />
                </Card>
                {/* <AgreeToPurchaseTerms className="step-terms-box" termsChecked={this.state.termsChecked} onCheckedChange={this.onTermsChange} buttonTextOverride={purchaseText} /> */}
                <Button className="step-buy-btn" onClick={this.createUser}>Create Account</Button>
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
    }
}
export default connect(mapStateToProps)(DetailConfirmation);
