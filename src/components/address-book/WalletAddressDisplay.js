import React from 'react';
import { Icon, Col, Button, Modal, Radio, Form, notification } from "antd";
import { connect } from 'react-redux';
import * as _ from 'lodash';
import WalletSelector from './WalletSelector';
import UserWalletManager from './UserWalletManager';
import { walletAddressIsInAddressBook, saveLocalWalletData, isValidWalletAddress } from '../../core/walletManagement';
import { loadPortfolioForWallet } from '../../core/user';
import WalletAddressInput from './WalletAddressInput';
import { WalletData } from '../../classes/WalletData';

class WalletAddressDisplay extends React.Component {

    state = {
        enterNewWallet: false,
        showAddToAddressBook: false,
        addressBookModalShown: false,
        textEnteredWallet: null
    };

    componentDidMount() {
        const defaultWallet = this.props.localUserWallets ? this.props.localUserWallets.defaultWallet : null;

        this.handleOnWalletChange(defaultWallet ? defaultWallet.address : null);
    }

    componentDidUpdate(prevprops, prevState) {

        let walletBeingChanged = false;

        const currentWallets = this.props.localUserWallets;
        const previousWallets = prevprops.localUserWallets;

        const currentDefaultWalletAddress = currentWallets && currentWallets.defaultWallet ? currentWallets.defaultWallet.address : undefined;
        const previousDefaultWalletAddress = previousWallets && previousWallets.defaultWallet ? previousWallets.defaultWallet.address : undefined;

        // if loadedAssets have changed (this occurs if we navigate here first) or coinbase changes
        if(prevprops.loadedAssets !== this.props.loadedAssets || this.props.coinbase !== prevprops.coinbase) {
            this.handleOnWalletChange(currentDefaultWalletAddress);
            walletBeingChanged = true;
        }

        // entering wallet directly
        if(this.state.enterNewWallet) {
            return;
            // enter wallet changed to select address book
        } else if(this.state.enterNewWallet !== prevState.enterNewWallet && !walletBeingChanged) {
            this.handleOnWalletChange(currentDefaultWalletAddress);
            walletBeingChanged = true;
        }

        // if default wallet has changed whilst updates going on
        if(this.state.addressBookModalShown && currentDefaultWalletAddress !== previousDefaultWalletAddress && !walletBeingChanged) {
            this.handleOnWalletChange(currentDefaultWalletAddress);
            walletBeingChanged = true;
        }

        // if current portfolio selected has changed
        if(prevprops.currentPortfolio !== this.props.currentPortfolio) {
            this.checkSelectedWallet();
        }
    }
    
    handleOnWalletChange = (walletAddress) => {
        loadPortfolioForWallet(this.props.loadedAssets, walletAddress);
    }

    handleAddressBookCancel = () => {
        this.setState({addressBookModalShown: false});
    }

    checkSelectedWallet = () => {
        const fieldValue = this.props.form.getFieldValue('addressSelector');

        if(fieldValue !== this.props.currentPortfolio) {
            this.props.form.setFieldsValue({['addressSelector']: this.props.currentPortfolio});
        }
    }

    onChangeWalletType = (e) => {

        const enterNewWallet = e.target.value;

        if(!enterNewWallet) {
            this.checkSelectedWallet();
        }

        this.setState({ enterNewWallet: enterNewWallet, showAddToAddressBook: false });

        const currentWallet = enterNewWallet ? undefined : this.props.form.getFieldValue('addressSelector');
        this.handleOnWalletChange(currentWallet);
    }

    validateTextWallet = (rule, value, callback) => {

        if(!isValidWalletAddress(this.props.web3, value, callback)) {
            this.setState({showAddToAddressBook: false});
            return;
        }

        const enteredAddress = value.trim();

        const isInAddressBook = walletAddressIsInAddressBook(this.props.localUserWallets.wallets, enteredAddress);
        this.setState({showAddToAddressBook: !isInAddressBook, textEnteredWallet: enteredAddress});

        this.handleOnWalletChange(enteredAddress);

        callback();
    }

    addToAddressBook = () => {

        const walletAddress = this.state.textEnteredWallet;
        const localWallets = this.props.localUserWallets.localWallets;

        if(!walletAddressIsInAddressBook(localWallets, walletAddress)) {
            const newWallet = new WalletData(walletAddress, null, localWallets.length === 0, true);   
            saveLocalWalletData([...localWallets, newWallet], this.props.currentUser);
        }

        this.setState({showAddToAddressBook: false});

        notification.success({
            message: 'Wallet Added to Address Book',
            description: <React.Fragment>
                '{this.state.textEnteredWallet}' was successfully added to your local address book.
                <br />Click on 'Manage Address Book' to add a description.
            </React.Fragment>,
            className: 'notification-success',
            duration: 10,
            placement: 'bottomRight'
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const isAddressSelectorDisabled = !this.props.localUserWallets || this.props.localUserWallets.wallets.length === 0;
        const showEnterWalletAddress = this.state.enterNewWallet === true || isAddressSelectorDisabled;

        return <React.Fragment>
            <Form>
                <Col xs={{span: 24}} lg={{span: 18}} xl={{span: 15}} style={{position: 'relative', bottom: 3, marginRight: 10 }}>
                    { showEnterWalletAddress === true && 
                    <WalletAddressInput placeholder="Enter a PUBLIC wallet address here to view cars held in that wallet..." getFieldDecorator={getFieldDecorator} isRequired={false} validator={this.validateTextWallet} addonAfter={this.state.showAddToAddressBook && <div onClick={this.addToAddressBook}>Add to Address Book</div>} /> }
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

export default Form.create()(connect(mapStateToProps)(WalletAddressDisplay));
