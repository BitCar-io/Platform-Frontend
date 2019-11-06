import React from 'react';
import { Row, Collapse } from 'antd';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { ETHEREUM_NETWORK_IDS } from '../../core/web3Providers';
import { URL_FAQ_STORAGE_WALLET } from '../../util/platformNavigation';
import { COLD_WALLET_TEXT, HOT_WALLET_TEXT } from '../../util/globalVariables';
import { trimAddress } from '../../util/helpers';

class SubHeaderContainer extends React.Component {

    render(){
      const platformWarningMessage = this.props.platformWarningMessage ? this.props.platformWarningMessage.platformMessage : undefined;
      const isConnectedWithColdWallet = this.props.currentUser && this.props.currentUser.isConnectedWithColdWallet;
      const connectedNetwork = this.props.connectedNetwork;
      const showNetworkAlert = connectedNetwork && !connectedNetwork.isSupported;

      if(showNetworkAlert) {
        return (<Row className="sub-header">
                <div className="align-center">
                  <div className="sub-header-alert network-alert">
                    You are not connected to a supported Ethereum Network.
                    <br />
                    You are currently connected to '{connectedNetwork.networkName}' (Id: {connectedNetwork.networkId}).
                    <br />
                    To use BitCar you need to connect to '{connectedNetwork.allowedNetworkNames}' (Id: {connectedNetwork.allowedNetworkIds})
                    <br />
                    In MetaMask: <img src={require('../../img/metamask-main-eth-network.jpg')} className="metamask-mainnet" />
                  </div>
                </div>
              </Row>);
      } else {
        return (<Row className="sub-header">
                  <div className="align-center">
                    {connectedNetwork && connectedNetwork.networkId === ETHEREUM_NETWORK_IDS.ropsten && <div className="test-mode-header">
                    TEST NET - No real purchases can be made.
                    </div>}
                    {isConnectedWithColdWallet &&
                        <div className="sub-header-alert">
                          You currently have your {COLD_WALLET_TEXT} wallet unlocked, please unlock your {HOT_WALLET_TEXT} wallet ({trimAddress(this.props.currentUser.hotWallet)}) to buy fractions of a car
                          <br />
                          BitCar recommends that the {COLD_WALLET_TEXT} wallet is kept offline and secure, for more information please <Link to={URL_FAQ_STORAGE_WALLET}>read our FAQ</Link>
                        </div>
                    }
                    {platformWarningMessage && <div className="sub-header-alert platform-alert">
                      <Collapse bordered={false}>
                        <Collapse.Panel header={`WARNING - ${platformWarningMessage.title} - Click to show/hide details`} key="1" showArrow={false}>
                          <span dangerouslySetInnerHTML={{__html: platformWarningMessage.message}} />
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                    }
                  </div>
            </Row>
        )
      }

    };
}
const mapStateToProps = (state) => {
  return {
    coinbase: state.UIstate.coinbase,
    currentUser: state.UIstate.currentUser,
    connectedNetwork: state.UIstate.connectedNetwork,
    platformWarningMessage: state.UIstate.platformWarningMessage
  }
}
export default connect(mapStateToProps)(SubHeaderContainer);
