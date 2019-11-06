import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
// import { logToConsoleInDev } from ".././util/helpers.js";
import { Row, Col, Card, Checkbox, Button, notification } from 'antd';
import { togglePending } from '../actions';
import store from '../store';
import { getOrLoadPlatformContract } from '../util/web3/contracts';
import { createUser } from '../core/user';
import { URL_DASHBOARD } from '../util/platformNavigation';

class TraderRegistration extends React.Component {
    state = {
        traderRegistrationMessages: [
            { id: 1, message: "Make sure you are visiting www.bitcar.eth to prevent any phishing attacks. We recommend that you install the Netcraft Anti-Phishing Extension (offered by www.netcraft.com).", checked: false },
            { id: 2, message: "Never install any browser plug-ins that claim to be associated with BitCar (except Netcraft Anti-Phishing Extension).", checked: false },
            { id: 3, message: "Never call a phone number from anyone claiming to be a member of BitCar Support.", checked: false },
            { id: 4, message: "Never share your wallet private key with anyone, including BitCar Support.", checked: false },
            { id: 5, message: "Never send funds to anyone claiming to be a member of BitCar Support.", checked: false }
        ],
        registrationEnabled: false
    }
    onCheckboxClick = (id) => {
        let newTraderRegMessages = this.state.traderRegistrationMessages.map(item => 
          (item.id === id) ? {...item, checked: !item.checked} : item);
          this.setState({ traderRegistrationMessages: newTraderRegMessages })
        if (newTraderRegMessages.filter(item => !item.checked).length === 0) {
            this.setState({ registrationEnabled: true });
        } else {
            this.setState({ registrationEnabled: false });
        }
    }
    onRegister() {
        store.dispatch(togglePending(true));

        if (this.props.coinbase) {
            getOrLoadPlatformContract('Trader').then(traderContract => {
                traderContract.methods.addAddressToTradersGroup(this.props.coinbase)
                    .send({from: this.props.coinbase || '', value: 10000000000000000})
                    .then(success => {
                        // create and store proper User object
                        createUser(this.props.coinbase, this.props.web3).then(user => {
                            store.dispatch(togglePending(false));
                            // toaster message
                            notification.success({
                                message: 'Registration complete!',
                                description: 'Welcome to your personal garage.',
                                className: 'notification-success',
                                duration: 6,
                                placement: 'bottomRight'
                            });
                            // reroute to dashboard
                            this.props.history.push(URL_DASHBOARD);
                        });
                }, error => {
                    // user cancellation
                    notification.error({
                        message: 'Error with transaction',
                        description: error,
                        className: 'notification-error',
                        duration: 6,
                        placement: 'bottomRight'
                    });
                });
            });
        }
    }
    render(){
        return (
        <React.Fragment>
            <Row>
                <Col span={12} offset={6}>
                    <Row>
                        <i className="pe-7s-add-user header-icon" />
                        <div className="header-titles">
                        <h1>Register {this.props.tokenId}</h1>
                        <h4 className="car-spec-sub">
                            Please read the following messages carefully and be sure to click each one.
                        </h4>
                        </div>
                    </Row>
                    {this.state.traderRegistrationMessages.map(item =>
                        <Card className="dash-stat-card" key={item.id}>
                            <Row>
                                <Col span={20} >{item.message}</Col>
                                <Col span={4}>
                                    <Checkbox className="register-check" onChange={() => this.onCheckboxClick(item.id)}>I Agree</Checkbox>
                                </Col>
                            </Row>
                        </Card>
                    )}
                    <br />
                    <Button type="primary" className="btn-center" onClick={() => this.onRegister()} 
                        disabled={!this.state.registrationEnabled || this.props.isPending} loading={this.props.isPending}>
                        Register
                    </Button>
                    <div className="align-center content">
                        <Link to={URL_DASHBOARD} disabled={this.props.isPending}>Return to Garage</Link>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
  return {
    isPending: state.UIstate.isPending,
    web3: state.UIstate.web3,
    coinbase: state.UIstate.coinbase,
    contracts: state.UIstate.contracts
  }
}
export default connect(mapStateToProps)(TraderRegistration);