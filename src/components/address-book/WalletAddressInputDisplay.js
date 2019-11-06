import React from 'react';
import { Col, Form, Icon } from "antd";
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { isValidWalletAddress } from '../../core/walletManagement';
import { loadPortfolioForWallet } from '../../core/user';
import WalletAddressInput from './WalletAddressInput';

class WalletAddressInputDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enterNewWallet: false,
            showAddToAddressBook: false,
            addressBookModalShown: false,
            textEnteredWallet: null
        };
    }
    
    handleOnWalletChange = (walletAddress) => {
        this.props.onWalletChanged(walletAddress);
        loadPortfolioForWallet(this.props.loadedAssets, walletAddress);
    }

    validateTextWallet = (rule, value, callback) => {

        const enteredAddress = value ? value.trim() : value;

        if(!value || !isValidWalletAddress(this.props.web3, enteredAddress, callback)) {
            this.handleOnWalletChange(null);
            return;
        }

        this.handleOnWalletChange(enteredAddress);

        callback();
    }

    clearAddressField = () => {
        this.props.form.setFieldsValue({['walletAddress']: ""});
        this.handleOnWalletChange(null);
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;

        return <React.Fragment>
            <Form>
                <Col xs={{span: 24}} lg={{span: 18}} xl={{span: 15}} style={{position: 'relative', bottom: 3, marginRight: 10 }}>
                    <WalletAddressInput 
                        placeholder="Enter a PUBLIC wallet address here to view cars held in that wallet..." 
                        getFieldDecorator={getFieldDecorator} 
                        isRequired={false} 
                        validator={this.validateTextWallet} 
                        addonAfter={<div onClick={this.clearAddressField}>{<Icon type="delete"/>}</div>} />
                </Col>
            </Form>
        </React.Fragment>
    }
}

const mapStateToProps = (state) => {
    return {
        loadedAssets: state.AssetState.loadedAssets,
        localUserWallets: state.UIstate.localUserWallets,
        currentPortfolio: state.UserState.currentPortfolio,
        coinbase: state.UIstate.coinbase,
        currentUser: state.UIstate.currentUser,
        web3: state.UIstate.web3
    }
}

export default Form.create()(connect(mapStateToProps)(WalletAddressInputDisplay));
