import React from 'react';
import { Row, Steps, Form } from 'antd';
import * as _ from 'lodash';
import MembershipSteps from "./MembershipSteps";
import { RANK_LEVELS_LOWERCASE } from '../../core/rankTracking';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";
import { URL_MEMBERSHIP_REGISTRATION, URL_MEMBERSHIP_BASE } from '../../util/platformNavigation';

const Step = Steps.Step;

export const MEMBERSHIP_STEPS = {
  accept: 'accept',
  termsAndConditions: 'termsandconditions',
  step0: '0',
  step1: '1',
  step2: '2'
};

class Membership extends React.Component {

    render() {
        const rankParameter = this.props.match.params.rank;
        const rankInteger = rankParameter ? RANK_LEVELS_LOWERCASE.indexOf(rankParameter) : 99;
        const currentRank = this.props.currentUser && this.props.currentUser.rank ? this.props.currentUser.rank : -1;
        const rank = currentRank >= rankInteger ? 'register' : rankParameter;
        return (
            <React.Fragment>

                {/* {  <span>
                    <Row>
                        <Steps>
                            <Step status={ step === '1' ? 'current' : 'complete'} title="Personal Info" icon={<Icon type="user" />} />
                            <Step status={ step === '2' ? 'current' : (parseInt(step) > 2 ? 'complete' : 'incomplete')} title="Proof of Address" icon={<Icon type="home" />} />
                            <Step status={ step === '3' ? 'current' : (parseInt(step) > 3 ? 'complete' : 'incomplete')} title="Wallets" icon={<Icon type="wallet" />} />
                            <Step status={ step === '4' ? 'current' : 'incomplete'} title="Submit" icon={<Icon type="upload" />} />
                        </Steps>
                    </Row>
                    <br /><br />
                </span> } */}
            
                <Row>
                    { (!rank || rank === 'register') && <Redirect to={URL_MEMBERSHIP_REGISTRATION} />}
                    { rank !== 'register' && <Route path={`${URL_MEMBERSHIP_BASE}:rank/:step`} component={ MembershipSteps } />}
                </Row>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.UIstate.currentUser
    }
  }
export default Form.create()(connect(mapStateToProps)(Membership));