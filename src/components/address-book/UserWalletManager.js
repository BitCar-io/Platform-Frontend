import React from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import { setPortfolioLoaded } from '../../actions';
import {Button, Col, Collapse, Form, Icon, Input, Popconfirm, Row, Table, Tooltip} from 'antd';
import {DefaultText, EditableCell, EditableFormRow} from './EditableCell';
import { saveLocalWalletData, walletAddressIsInAddressBook, isValidWalletAddress } from '../../core/walletManagement';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import WalletAddressInput from './WalletAddressInput';
import { WalletData } from '../../classes/WalletData';

class UserWalletManager extends React.Component {

    constructor(props) {
        super(props);

        this.walletReadColumns = [{
            title: 'Default?',
            dataIndex: 'isDefault',
            width: 12,
            render: (text, record) => (
                (!record.isDefault &&
                <Popconfirm title="Are you sure you want to make this Wallet the default one for your garage portfolio?"
                    cancelText="Cancel"
                    okText="Yes make it the default"
                    overlayClassName="wallet-manager"
                    onConfirm={() => this.handleMakeDefault(record.key)}>
                    <a href="javascript:;">Make Default</a>
                </Popconfirm>)
                ||
                ("Yes")
            )
        },{
            title: 'Wallet Address',
            dataIndex: 'address',
            key: 'address',
            width: 100,
            render: (text, record) => (
                <BlockchainAddressToolTip address={text} showTitle={false} isToken={false} />
            )
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            editable: true,
            render: (text, record) => (
                <span>{text && text.trim().length > 0 ? text : DefaultText}</span>
            )
        }, {
            title: '',
            dataIndex: 'operation',
            render: (text, record) => (
                <Popconfirm title="Are you sure you want to remove this Wallet from your platform portfolio?"
                    cancelText="Cancel"
                    okText="Yes remove it"
                    overlayClassName="wallet-manager"
                    onConfirm={() => this.handleDelete(record.key)}>
                    <a href="javascript:;">Delete</a>
                </Popconfirm>
            )
          }];
        
        const localWallets = this.props.localUserWallets.localWallets;
        this.state = {instructionsOpen: localWallets.length === 0, isCoinbaseInAddressBook: walletAddressIsInAddressBook(localWallets, this.props.coinbase) };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.coinbase !== this.props.coinbase) {
            this.checkCurrentCoinbase(this.props.localUserWallets.localWallets);
        }
    }

    checkCurrentCoinbase = (wallets) => {
        this.setState({isCoinbaseInAddressBook: !this.props.coinbase || walletAddressIsInAddressBook(wallets, this.props.coinbase)});
    }

    handleAddWallet = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err) {
                return;
            }

            const wallets = this.props.localUserWallets.localWallets;
            const walletAddress = values["walletAddress"];
            const description = values["description"] && values["description"].trim().length > 0 ? values["description"] : null;

            const newWallet = new WalletData(walletAddress, description, wallets.length === 0, true);

            this.saveDataChanges([...wallets, newWallet]);

            this.props.form.resetFields();
        });
    }

    handleMakeDefault = (key) => {
        const newData = [...this.props.localUserWallets.localWallets];
        newData.forEach(item => item.isDefault = item.key === key);
        this.saveDataChanges(newData);
    }

    handleSave = (row) => {
        const newData = [...this.props.localUserWallets.localWallets];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        this.saveDataChanges(newData);
      }

    handleDelete = (key) => {
        const wallets = [...this.props.localUserWallets.localWallets].filter(item => item.key !== key);

        if(wallets.length === 1) {
            wallets[0].isDefault = true;
        }
      
        this.saveDataChanges(wallets);
    }

    saveDataChanges = wallets => {
        saveLocalWalletData(wallets, this.props.currentUser);
        this.checkCurrentCoinbase(wallets);
    }

    handleWalletChange = walletAddress => {

        if(this.props.currentPortfolio === walletAddress) {
            store.dispatch(setPortfolioLoaded(true));
            return;
        }
    }

    validateWallet = (rule, value, callback) => {
        if(!isValidWalletAddress(this.props.web3, value, callback)) {
            return;
        }

        if(walletAddressIsInAddressBook(this.props.localUserWallets.localWallets, value.trim())) {
            callback("This wallet has already been added to the address book");
            return;
        }

        callback();
    }

    addCurrentClick = () => {
        this.props.form.setFieldsValue({['walletAddress']: this.props.coinbase});
    }

    instructionViewChanged = (key) => {
        this.setState({instructionsOpen: key.length > 0});
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };
          const columns = this.walletReadColumns.map((col) => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
          });

        return  <div className="wallet-manager">
            <h1>Add Wallets for Displaying Cars in Your Garage</h1>
            <p>By adding PUBLIC wallet addresses below, you will be able to view the cars within that wallet in your garage, using the 'Select from address book' drop-down list.</p>
            <h3 className="text-white">REMEMBER - DO NOT enter your private key - NEVER divulge your private key to anyone.</h3>
            <Row className="add-address" gutter={16}>
                <Form>
                    <Col span={13}>
                        <WalletAddressInput coinbase={this.props.coinbase} getFieldDecorator={getFieldDecorator} isRequired={true} validator={this.validateWallet}
                            addonAfter={!this.state.isCoinbaseInAddressBook && <Tooltip placement="bottom" title={`Click to enter currently Unlocked Wallet (${this.props.coinbase})`}>
                                        <div onClick={this.addCurrentClick}>
                                            <Icon type="left-square" />
                                        </div>
                                        </Tooltip>}
                        />
                    </Col>
                    <Col span={7}>
                        <Form.Item name="description" style={{marginBottom: 10}}>
                            {getFieldDecorator('description')(
                            <Input htmltype="text" placeholder="Please enter a description" maxLength={25} autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button htmlType="submit" onClick={this.handleAddWallet}>Add Wallet</Button>
                    </Col>
                </Form>
            </Row>
            <Row>
                <Col span={24}>
                    <Table bordered components={components} rowClassName={() => 'editable-row'} columns={columns} pagination={{ pageSize:5, hideOnSinglePage:true}} 
                        dataSource={this.props.localUserWallets.localWallets}  />
                        <br />
                        <Collapse accordian bordered={true} defaultActiveKey={this.props.localUserWallets.localWallets.length > 0 ? ['0'] : ['1']} onChange={this.instructionViewChanged}>
                            <Collapse.Panel header={`Click to ${this.state.instructionsOpen ? 'hide' : 'view'} Address Book instructions`} key='1'>
                                <p>These PUBLIC addresses are stored in your browser on this computer, so that you can always view your portfolio without unlocking your wallet.</p>
                                <ul>
                                    <li>You can set which wallet to load by default using the 'Make Default' link next to the wallet address</li>
                                    <li>You can add any Ethereum address to your address book, you can then view the cars stored in that address in 'My Garage'</li>
                                    <li>Edit the description for a wallet at anytime by clicking the description in the table and pressing ENTER on your keyboard or clicking outside to save your changes.</li>
                                    <li>To remove a wallet from the table click on the 'delete' link</li>
                                    <li>You can change which wallet is currently being used to display cars in your garage by selecting 'Select from address book' and choosing it from the drop-down box under the 'My Garage' title.</li>
                                    <li>If you hover over the wallets in the drop down box, you will get a link which takes you to the wallet transactions on Etherscan.io</li>
                                    {!this.state.isCoinbaseInAddressBook && <li>Your currently unlocked wallet will always appear in the drop-down box and can be added to your address book by clicking on the '<Icon type="left-square" />' icon above</li>}
                                </ul>
                                <h3 className="text-white">REMEMBER - DO NOT enter your private key - NEVER divulge your private key to anyone.</h3>
                            </Collapse.Panel>
                        </Collapse>
                </Col>
            </Row>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        coinbase: state.UIstate.coinbase,
        currentPortfolio: state.UserState.currentPortfolio,
        localUserWallets: state.UIstate.localUserWallets,
        currentUser: state.UIstate.currentUser,
        web3: state.UIstate.web3
    }
}

export default Form.create()(connect(mapStateToProps)(UserWalletManager));