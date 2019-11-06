import React from 'react';
import { Icon, Row, Col, Button, Modal, Form, Input, Select, Alert } from "antd";
import * as _ from 'lodash';
import { BITCAR_TELEGRAM } from '../../util/globalVariables';
import { sendTransaction, callEthereumMethod } from "../../util/web3/web3Wrapper";
import Web3ResponseHandler from '../Web3ResponseHandler';
import LoadingIndicator from '../LoadingIndicator';
import { doesAllowanceNeedToBeSet, setAllowance } from '../../core/tokenPurchase';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import Web3SendResponse from '../../classes/Web3SendResponse';
import { convertToSolidityNumber } from '../../util/helpers';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { getCategories } from '../../core/assetBallot';

class NewChangeRequestModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            categoriesDisabled: true,
            web3Response: undefined,
            status: undefined,
            transactionHash: undefined
        };
    }

    handleCreateRequestSubmit = event => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                this.setState({web3Response: undefined, transactionHash: undefined});
                const assetAddress = this.props.form.getFieldValue('car');
                const asset = this.props.portfolioAssets[assetAddress];
                const assetControlBallotContract = asset.assetControlBallotContract;
                const allowanceRequired = new BigNumber(10).shiftedBy(8);
                const allowanceNeedsSetting = await doesAllowanceNeedToBeSet(this.props.web3, this.props.coinbase, assetControlBallotContract.address, allowanceRequired);
                if (allowanceNeedsSetting) {
                    this.setState({status: this.props.transactionStatuses.allowance});
                    setAllowance(this.props.web3, this.props.coinbase, assetControlBallotContract.address, allowanceRequired).then( async () => {
                        this.createNewVote(asset);
                    }).catch(error => this.setState({web3Response: error, status: this.props.transactionStatuses.none}) );
                } else {
                    this.setState({status: this.props.transactionStatuses.send});
                    this.createNewVote(asset);
                }
            }
        });
    }

    createNewVote = async (asset) => {
        const randomId = this.props.web3.utils.randomHex(32);
        const category = this.props.form.getFieldValue('category');
        sendTransaction(true, this.props.web3, asset.assetControlBallotContract.methods.createVote(category, randomId), {from: this.props.coinbase}).then(result => {
            console.log('result', result)
            this.props.loadAndSortChangeRequests();
            this.setState({status: this.props.transactionStatuses.none, web3Response: result, transactionHash: result.receipt.transactionHash});
        }, error => this.setState({web3Response: error, status: this.props.transactionStatuses.none}));
    }

    loadCategories = async (assetAddress) => {

        this.setState({categoriesDisabled: true});

        const asset = this.props.portfolioAssets[assetAddress];

        if(!asset) {
            return;
        }

        const categories = await getCategories(asset.assetControlBallotContract);

        this.setState({categories: categories, categoriesDisabled: false});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return <Modal visible={this.props.newChangeRequestModalShown} onCancel={this.props.closeNewChangeRequestModal}
            footer={[
                <div key="back" onClick={this.props.closeNewChangeRequestModal} className="text-primary align-left clickable"><Icon type="arrow-left" /> Back</div>
            ]}>
            <h2>New Change Request</h2>
            <Form onSubmit={this.handleCreateRequestSubmit}>
                <Row>
                    <p>Please conduct all discussions surrounding this change on the official BitCar Telegram page: <a href={BITCAR_TELEGRAM} target="_blank">{BITCAR_TELEGRAM}</a></p>
                </Row>
                <Row>
                    <Form.Item label="Car" >
                        {getFieldDecorator('car', {
                            rules: [{required: true, message: 'Please select a car.'}]
                        })(
                            <Select onSelect={this.loadCategories}>
                                { _.map(this.props.portfolioAssets, (asset, i) => <Select.Option key={i}>{asset.data.make} {asset.data.model} ({asset.tokenCode})</Select.Option>) }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Request type" >
                        {getFieldDecorator('category', {
                            rules: [{required: true, message: 'Please select the request type.'}]
                        })(
                            <Select disabled={this.state.categoriesDisabled}>
                                {!this.state.categoriesDisabled && this.state.categories.map((category, index) =>
                                    <Select.Option key={index}>{category.title}</Select.Option>
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </Row>
                <Row className="align-center">
                    <Button onClick={this.handleCreateRequestSubmit} disabled={this.state.status} style={{ width: '50%'}}>
                        {!this.state.status && 'Create Request'}
                        {this.state.status && <LoadingIndicator text={' '} />}
                    </Button>
                </Row>
                <br />
                <Row>
                    { this.state.status === this.props.transactionStatuses.allowance && <Alert type="warning"
                    message="Step 1/2: Setting BitCar allowance"
                    description="Your wallet provider will prompt you to grant permission for the application to spend BitCar on your behalf. This is necessary to 
                    complete the transaction and does not actually spend any currency except for the gas cost. Please do not close or refresh your browser."
                    showIcon /> }
                    { this.state.status === this.props.transactionStatuses.send && <Alert type="warning"
                    message="Step 2/2: Creating Vote"
                    description="Please check your wallet provider and approve the transaction to complete creation of the vote. Please do not close or refresh your browser."
                    showIcon /> }
                </Row>
                { this.state.web3Response && <div style={{marginTop: 10}}>
                        <Web3ResponseHandler web3Response={this.state.web3Response} successMessage={'Transaction successfully completed.'} />
                        { this.state.transactionHash && <React.Fragment>
                            <p className="stat-title">
                                Transaction Hash:
                            </p>
                            <p className="stat-body">
                                <BlockchainAddressToolTip address={this.state.transactionHash} showTitle={false} isToken={false} />
                            </p>
                            </React.Fragment>
                        } 
                </div> }
            </Form>
        </Modal>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase
    }
  }
export default Form.create()(connect(mapStateToProps)(NewChangeRequestModal));