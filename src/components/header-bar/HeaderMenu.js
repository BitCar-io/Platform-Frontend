import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';

import Login from './Login';
import { signoutUser } from '../../core/user';

import { URL_BAZAAR, URL_MEMBERSHIP_REGISTRATION, URL_DASHBOARD, URL_HOME, URL_REDEEM } from '../../util/platformNavigation'
import PlatformMenuItem from './PlatformMenuItem';

class HeaderMenu extends Component {
    render() {
        const isNetworkValid = (this.props.connectedNetwork && this.props.connectedNetwork.isSupported) === true;
        const isRegistered = this.props.currentUser && this.props.currentUser.rank;

        return (
        <Menu theme="dark" mode={this.props.mode} selectable={false}>
            <Menu.Item key="home">
                <PlatformMenuItem onClick={this.props.onClose} linkTo={URL_HOME} iconClass="fas fa-home" text="Home" />
            </Menu.Item>
            <Menu.Item key="unlock">
                <PlatformMenuItem isShown={isNetworkValid} onClick={() => { this.props.onClose(), signoutUser() }} linkTo="#" iconClass="fas fa-sign-out-alt" text="Sign out">
                    { !this.props.coinbase && <Login onClick={this.props.onClose}/> }
                </PlatformMenuItem>
            </Menu.Item>
            <Menu.Item key="garage">
                <PlatformMenuItem isShown={isNetworkValid} onClick={this.props.onClose} linkTo={URL_DASHBOARD} iconClass="fas fa-tachometer-alt" text="My Garage" />
            </Menu.Item>
            <Menu.Item key="membership">
                <PlatformMenuItem isShown={isNetworkValid} onClick={this.props.onClose} linkTo={URL_MEMBERSHIP_REGISTRATION} iconClass={`fas fa-user${isRegistered ? "" : "-plus"}`} text={isRegistered? "Membership" : "Register"} />
            </Menu.Item>
            <Menu.Item key="bazaar">
                <PlatformMenuItem isShown={isNetworkValid} reduce={true} onClick={this.props.onClose} linkTo={URL_BAZAAR} iconClass="fas fa-exchange-alt" text="BitCar Bazaar" />
            </Menu.Item>
	<Menu.Item key="redeem">
                <PlatformMenuItem isShown={isNetworkValid} onClick={this.props.onClose} linkTo={URL_REDEEM} iconClass="fas fa-gift" text="Redeem PayPal Code" />
            </Menu.Item>
        </Menu>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        coinbase: state.UIstate.coinbase,
        connectedNetwork: state.UIstate.connectedNetwork,
        currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(HeaderMenu);
