import React from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import { Button, Modal, Icon, Radio, Alert, Tooltip, Row, Col } from 'antd';
import { createUser } from '../../core/user';
import { setUserLoggedOut } from '../../actions';
// import ComingSoon from '../ComingSoon';
import RadioGroup from 'antd/lib/radio/group';
import LoadingIndicator from '../LoadingIndicator';
import MetaMaskNotification from '../MetaMaskNotification';

import { Link } from "react-router-dom";

const metamask_logo = require('../../logos/wallets/metamask-fox.svg');
// let ledger_logo;
// let trezor_logo;
// let coinbase_logo;
// let trustwallet_logo;
// import('../../logos/wallets/ledger-logo.svg').then(result => ledger_logo = result);
// import('../../logos/wallets/trezor-logo.svg').then(result => trezor_logo = result);
// import('../../logos/wallets/trust-wallet.svg').then(result => trustwallet_logo = result);

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            currentWallet: 'metamask',
            isConnected: false,
            isConnecting: false,
            isPending: false,
            isCancelled: false
        }
    }

    showModal = () => {
        this.props.onClick ? this.props.onClick() : null;
        
        this.setState({modalVisible: true})
    }
    hideModal = () => {
        this.setState({modalVisible: false})
    }

    handleUnlockSoftwareWallet = () => {

        this.setState({isPending: true, isConnected: false, isConnecting: false, isCancelled: false});

        setTimeout(this.unlockNotificationDelay, 200);

        // LOG IN LOGIC
        if (window.ethereum) {
            window.ethereum.enable().then(coinbase => {

                // console.log('Metamask Unlocked for account access', coinbase[0]);
                this.setState({isConnecting: false, isConnected: true, isCancelled: false});

                store.dispatch(setUserLoggedOut(false));
                createUser(coinbase[0], this.props.web3);

            }).catch(error => {
                this.setState({isPending: false, isCancelled: true});
            });
        }
    }

    unlockNotificationDelay = () => {

        if(this.state.isConnected) {
            return;
        }

        this.setState({isConnecting: true});
    }

    render() {
        const unlockButtonText = this.props.unlockButtonText ? this.props.unlockButtonText : "Unlock Wallet";
        const unlockButtonClass = this.props.unlockButtonClass ? this.props.unlockButtonClass : "";
        const hasMetaMask = window.web3 && window.web3.currentProvider && window.web3.currentProvider.isMetaMask;
        const metaMaskAlt = hasMetaMask ? "MetaMask" : "MetaMask is currently required to purchase fractions of any car, additional providers will be coming soon.";
        const isCancelled = this.state.isCancelled;
        const alertMessage = <span>
        {isCancelled ? `You need to allow MetaMask to 'Connect' to BitCar before you can unlock your wallet, you clicked 'Cancel', please click '${unlockButtonText}' again.` : "Please check MetaMask prompts to 'Connect' to BitCar."}
        {!isCancelled && <MetaMaskNotification /> }
    </span>;
        return <React.Fragment>
                <Link to="#" className={unlockButtonClass} onClick={this.showModal}><i className="fas fa-unlock"></i>{unlockButtonText}</Link>
                <Modal
                    title="Unlock a wallet to interact with the BitCar platform"
                    visible={this.state.modalVisible}
                    onCancel={this.hideModal}
                    footer={[
                        <div key="back" onClick={this.hideModal} className="buy-modal-footer"><Icon type="left" /> Close</div>
                    ]}
                    >
                    <div className="unlock-wallet-wrapper">
                        <Row className="login-wallet-selection" type="flex" justify="center">
                            <RadioGroup value={this.state.selectedWallet} value={hasMetaMask ? this.state.currentWallet : null}>
                                <Radio.Button disabled={!hasMetaMask} value='metamask' className="unlock-metamask">
                                    <Col className="login-wallet-option">
                                        <img src={metamask_logo}  alt={metaMaskAlt} title={metaMaskAlt} />
                                        <br />
                                        <span>
                                            MetaMask
                                        </span>
                                    </Col>
                                </Radio.Button>
                                <Radio.Button disabled={true} value='hardware' className="unlock-hardware">
                                    <span title="Hardware wallet support Coming Soon!">
                                        <Icon twoToneColor="gray" type="usb" />
                                        <br />
                                        <span>
                                            Hardware Wallet
                                        </span>
                                    </span>
                                </Radio.Button>
                            </RadioGroup>
                        </Row>
                        <br />
                        {hasMetaMask && <Button size="large" onClick={this.handleUnlockSoftwareWallet} disabled={this.state.isPending}>{this.state.isPending ? <LoadingIndicator className="loading-indicator" text={' '} /> : "Unlock Wallet"} </Button>}
                        {!hasMetaMask && <Alert type="warning" className="metamask-prompt-alert" showIcon 
                                            message={<span title={metaMaskAlt}>
                                                MetaMask not detected - the BitCar platform currently requires MetaMask to purchase fractions of a car - you can <a href="https://metamask.io/" target='_blank' title="Open MetaMask website in new window">download it here</a>.                                                
                                                Once installed, reload the BitCar platform to unlock your wallet.</span>} />}
                        {!isCancelled && hasMetaMask && this.state.isConnecting && 
                            <Alert type="warning" showIcon className="metamask-prompt-alert"
                                message={alertMessage} />
                        }
                        {isCancelled && <Alert type="warning" showIcon className="metamask-prompt-alert"
                                message={alertMessage} />}
                        {/* <h4>Software wallet (MetaMask, Trust Wallet etc.)</h4>
                        <RadioGroup className="login-wallet-selection" value={this.state.selectedWallet} value={this.state.currentWallet}>
                            <Radio disabled={!hasMetaMask} value='metamask'><img src={metamask_logo} width={100} alt={metaMaskAlt} title={metaMaskAlt} />{metaMaskText}</Radio>
                            {hasMetaMask && <Radio disabled={true} value='trustWallet' title="Future Release"><img src={trustwallet_logo} width={100} alt="Trust Wallet" title="Future Release" /></Radio>}
                        </RadioGroup>
                        <br />
                        {hasMetaMask && <Button onClick={this.handleUnlockSoftwareWallet}>Unlock Software Wallet</Button>}
                        {!hasMetaMask && <Alert type="warning" showIcon message="Please install MetaMask to unlock a wallet" />}
                        <br /><br />

                        <h4>Hardware wallet (Ledger Nano, Trezor, etc.)</h4>
                        <Button disabled={true} onClick={this.handleUnlockSoftwareWallet} title="Coming Soon">Unlock Hardware Wallet</Button>
                        <ComingSoon /> */}
                    </div>
                </Modal>
            </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3
    }
}
export default connect(mapStateToProps)(Login);
