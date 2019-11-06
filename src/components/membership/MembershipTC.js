import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Checkbox, Button } from 'antd';
import { MEMBERSHIP_STEPS } from './Membership';
import TermsAndConditions from "../legal/TermsAndConditions";
import { scrollToTop } from '../../util/helpers';
import Axios from 'axios';
import { getMembershipServerErrorMessage } from '../../util/web3/errorMessaging';
import { MEMBERSHIP_RESPONSE } from '../../util/globalVariables';

class MembershipTC extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            termsChecked: false,
            isPending: false
        };

        this.termsAndConditions = React.createRef();
    }

    componentDidMount = () => {
        this.handleTermsScroll(null);
        scrollToTop();
    }

    onTermsChange = () => {
        this.setState({termsChecked: !this.state.termsChecked});
    }

    handleTermsScroll = (e) => {

        const currentScroll = this.termsAndConditions.scrollTop + this.termsAndConditions.offsetHeight;

        const bottom = currentScroll > (this.termsAndConditions.scrollHeight - 10);

        if (bottom) { 
            this.setState({termsRead: true })
        };
    }

    onTermsContinue = () => {

        this.setState({isPending: true});

        Axios.get(process.env.REACT_APP_KYC_API_READ_BASE_URL, {
            validateStatus: this.validateServerResponse
        }).then(response => {
            this.setState({isPending: false});

            this.props.clearError && this.props.clearError();

            const isExistingMember = this.props.currentUser && this.props.currentUser.rank;
            this.props.onTermsComplete(isExistingMember);

        }).catch(error => {
            const statusCode = error.response && error.response.status ? error.response.status : 0;
            const errorMessage = getMembershipServerErrorMessage(statusCode);
            this.props.handleError && this.props.handleError('', error, errorMessage);

            this.setState({isPending: false});
        });
    }

    validateServerResponse = (status) => {
        // console.log('validating', status);
        // console.log('is req valid?', (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid);
        // standard responses, but allow invalid headers as just testing for geo and server state 
        return (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid;
    }

    render(){       

        return <React.Fragment>
            <h3 className="membership-subtitle">Please read the following Terms and Conditions for use of the platform</h3>
            <div ref={ref => (this.termsAndConditions = ref)} className="terms-conditions-box" onScroll={this.handleTermsScroll}>
                <span><TermsAndConditions /></span>
            </div>
            <div className="align-center">
                <Checkbox checked={this.state.termsChecked} disabled={!this.state.termsRead} onChange={this.onTermsChange}>
                    <span className={this.state.termsRead ? 'text-brighter' : 'text-disabled'} title={!this.state.termsRead ? "Please read all terms and conditions above" : undefined}>
                        I have read and agree to the Terms and Conditions
                    </span>
                </Checkbox>
            </div>
            <br />
            <Button type="primary" className="btn-center membership-continue" onClick={this.onTermsContinue}
                disabled={!this.state.termsChecked || this.state.isPending} 
                loading={this.props.isPending || this.state.isPending}>
                {this.state.isPending ? "Verifying" : this.props.buttonText ? this.props.buttonText : "Continue"}
            </Button>
            <br />
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
  return {
    isPending: state.UIstate.isPending,
    web3: state.UIstate.web3,
    coinbase: state.UIstate.coinbase,
    contracts: state.UIstate.contracts,
    currentUser: state.UIstate.currentUser
  }
}
export default connect(mapStateToProps)(MembershipTC);