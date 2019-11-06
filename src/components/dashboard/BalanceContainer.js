import React from "react";
import { connect } from 'react-redux';
import { Modal, Button, Row, Col, Card, Tooltip } from "antd";
import BitCarBalance from "./BitCarBalance";
import BalanceDisplay from "./BalanceDisplay";
import { setUserEthereumBalance, haveUserWalletsChanged } from "../../core/user";
import AddTokenToMetaMask from "../AddTokenToMetaMask";
import { BITCAR_SHIELD_IMAGE } from "../../util/globalVariables";

import { HotWalletIcon, ColdWalletIcon } from '../WalletIcons';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';

const { Meta } = Card;

class BalanceContainer extends React.Component {

    componentDidMount() {
        setUserEthereumBalance(this.props.web3, this.props.currentUser);
    }

    componentDidUpdate(prevprops) {
        if(prevprops.coinbase != this.props.coinbase || haveUserWalletsChanged(prevprops.currentUser, this.props.currentUser)) {
            setUserEthereumBalance(this.props.web3, this.props.currentUser);
        }
    }

    render() {
        const hotWallet = this.props.currentUser && this.props.currentUser.hotWallet ? this.props.currentUser.hotWallet : this.props.coinbase;
        const coldWallet = this.props.currentUser && this.props.currentUser.coldWallet ? this.props.currentUser.coldWallet : "N/A";
        const hotBitCarBalance = this.props.bitcarDisplayBalance[hotWallet];
        const coldBitCarBalance = this.props.currentUser && this.props.currentUser.coldWallet ? this.props.bitcarDisplayBalance[this.props.currentUser.coldWallet] : undefined;
        const hotEtherBalance = this.props.etherDisplayBalances[hotWallet];
        const coldEtherBalance = this.props.currentUser && this.props.currentUser.coldWallet ? this.props.etherDisplayBalances[this.props.currentUser.coldWallet] : undefined;

        return (
        <React.Fragment>
            <Row className="balance-container" gutter={{ lg: 16, xl: 16 }}>
                <Col sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:12}}>
                    <Card className="dash-stat-card">
                        <Meta
                            avatar={<HotWalletIcon className="wallet-icon" />}
                            title="Trading Address"
                            description=
                            {
                                <Row>
                                    <i className="fab fa-ethereum ethereum-icon" /> <BlockchainAddressToolTip showEthereumBtn={false} showMetaMaskBtn={false} trimAddress={true} address={hotWallet} />
                                </Row>
                            }
                        />
                    </Card>
                </Col>

                <Col sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:12}}>
                    <Card className="dash-stat-card">
                        <Meta
                            avatar={<ColdWalletIcon className="wallet-icon" />}
                            title="Storage Address"
                            description=
                            {
                                <Row>
                                    <i className="fab fa-ethereum ethereum-icon" /> <BlockchainAddressToolTip showEthereumBtn={false} showMetaMaskBtn={false} trimAddress={true} address={coldWallet} />
                                </Row>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            
            <Row className="balance-container" gutter={{ lg: 16, xl: 16 }}>
                <Col sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:12}}>
                    <BalanceDisplay isBitCar={true} tradingBalance={hotBitCarBalance} storageBalance={coldBitCarBalance} type="BitCar" contractAddress={this.props.platformTokenContract && this.props.platformTokenContract._address} />
                </Col>

                <Col sm={{span:24}} md={{span:24}} lg={{span:12}} xl={{span:12}}>
                    <BalanceDisplay isEthereum={true} tradingBalance={hotEtherBalance} storageBalance={coldEtherBalance} type="Ethereum" />
                </Col>
            </Row>
        </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
  return {
    web3: state.UIstate.web3,
    coinbase: state.UIstate.coinbase,
    currentUser: state.UIstate.currentUser,
    platformTokenContract: state.UIstate.platformTokenContract,
    bitcarDisplayBalance: state.UserState.bitcarDisplayBalance,
    etherDisplayBalances: state.UserState.etherDisplayBalances
  }
}
export default connect(mapStateToProps)(BalanceContainer);