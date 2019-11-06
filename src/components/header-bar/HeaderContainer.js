import React from "react";
import { Link } from "react-router-dom";
import { createUser } from '../../core/user';
import store from '../../store';
import { setUserLoggedOut } from '../../actions';
import { connect } from 'react-redux';
import { URL_HOME } from "../../util/platformNavigation";

import HeaderMenu from './HeaderMenu';
import { Drawer, Button, Icon } from 'antd';
import '../../style/Navbar.scss';

const bitcar_logo = require('../../logos/logo_bitcar.png');

class HeaderContainer extends React.Component {
    state = {
        visible: false
      };
    
      showDrawer = () => {
        this.setState({
          visible: true
        });
      };
    
      onClose = () => {
        this.setState({
          visible: false
        });
      };

  componentDidMount() {
    // AUTOMATICALLY LOGIN FOR DEVELOPMENT
    if (this.props.web3 && this.props.connectedNetwork && this.props.connectedNetwork.isSupported && process.env.NODE_ENV === "development") {
      if (window.ethereum) {
        window.ethereum.enable().then(coinbase => {
            // console.log("Metamask Unlocked for account access", coinbase[0]);

            store.dispatch(setUserLoggedOut(false));
            createUser(coinbase[0], this.props.web3);
          }
        );
      }
    }
  }

  render() {
    return (
      <nav className="menu no-print">
        <div className="menu__logo">
            <div className="header-logo">
                <Link to={URL_HOME}>
                    <img src={bitcar_logo} width={170} alt="bitcar logo" />
                </Link>
            </div>
        </div>
        <div className="menu__container">
          <div className="menu_rigth">
            <HeaderMenu onClose={this.onClose} mode="horizontal" />
          </div>
          <Button
            className="menu__mobile-button"
            type="primary"
            onClick={this.showDrawer}
          >
            <Icon type="bars" />
          </Button>
          <Drawer
            title="Menu"
            placement="right"
            className="menu_drawer"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <HeaderMenu onClose={this.onClose} mode="inline" />
          </Drawer>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3,
        connectedNetwork: state.UIstate.connectedNetwork
    }
}
export default connect(mapStateToProps)(HeaderContainer);
