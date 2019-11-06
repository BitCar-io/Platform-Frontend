import React from 'react';
import { Card, Icon, Row, Col, Button, Modal, Tag, Checkbox } from "antd";
import * as _ from 'lodash';
import { BITCAR_TELEGRAM } from '../../util/globalVariables';
import { convertFromSolidityAndFormatForDisplay } from '../../util/helpers';
import { connect } from 'react-redux';
import { doesAllowanceNeedToBeSet, setAllowance } from '../../core/tokenPurchase';
import { sendTransaction } from "../../util/web3/web3Wrapper";
import Moment from 'react-moment';
import BigNumber from 'bignumber.js';

class ChangeRequestModal extends React.Component {

    state = {
        web3Response: undefined,
        termsAgreed: false,
        status: undefined
    }

    onCheckboxClick = () => {
        this.setState({termsAgreed: !this.state.termsAgreed});
    }

    handleVote = async event => {
        event.preventDefault();
        this.voteOrUnvote(true);
    }

    handleUnVote = async event => {
        event.preventDefault();
        this.voteOrUnvote(false);
    }

    voteOrUnvote = async voting => {
        this.setState({web3Response: undefined, transactionHash: undefined});
        const asset = this.props.changeRequestCurrentlyOpen.portfolioAsset;
        const assetControlBallotContract = asset.assetControlBallotContract;

        const allowanceRequired = new BigNumber(10).shiftedBy(8);

        const allowanceNeedsSetting = await doesAllowanceNeedToBeSet(this.props.web3, this.props.coinbase, assetControlBallotContract.address, allowanceRequired);
        if (allowanceNeedsSetting) {
            this.setState({status: this.props.transactionStatuses.allowance});
            setAllowance(this.props.web3, this.props.coinbase, assetControlBallotContract.address, allowanceRequired).then( async () => {
                if (voting) {
                    this.vote(asset);
                } else {
                    this.unVote(asset);
                }
            }).catch(error => this.setState({web3Response: error, status: this.props.transactionStatuses.none}) );
        } else {
            this.setState({status: this.props.transactionStatuses.send});
            if (voting) {
                this.vote(asset);
            } else {
                this.unVote(asset);
            }
        }
    }

    vote = (asset) => {
        console.log('voting')
        const voteID = this.props.changeRequestCurrentlyOpen.voteID;
        sendTransaction(true, this.props.web3, asset.assetControlBallotContract.methods.vote(voteID), {from: this.props.coinbase}).then(result => {
            this.props.loadAndSortChangeRequests();
            this.setState({status: this.props.transactionStatuses.none, web3Response: result, transactionHash: result.receipt.transactionHash});
        }, error => this.setState({web3Response: error, status: this.props.transactionStatuses.none}));
    }
    unVote = (asset) => {
        console.log('unvoting')
        const voteID = this.props.changeRequestCurrentlyOpen.voteID;
        sendTransaction(true, this.props.web3, asset.assetControlBallotContract.methods.cancelVote(voteID), {from: this.props.coinbase}).then(result => {
            this.props.loadAndSortChangeRequests();
            this.setState({status: this.props.transactionStatuses.none, web3Response: result, transactionHash: result.receipt.transactionHash});
        }, error => this.setState({web3Response: error, status: this.props.transactionStatuses.none}));
    }

    render() {
        console.log(this.props.changeRequestCurrentlyOpen)
        const changeRequest = this.props.changeRequestCurrentlyOpen;
        const userHasVoted = changeRequest && changeRequest.userHasVoted;
        const minVotes = changeRequest && changeRequest.minVotes;
        const numVotes = changeRequest && changeRequest.numVotes;
        const numVotesPercentage = numVotes && minVotes && numVotes.dividedBy(minVotes).multipliedBy(100);
        const createdDate = changeRequest && changeRequest.creationTime;
        const totalVotesRequiredPercentage = changeRequest && changeRequest.minVotes.dividedBy(changeRequest.portfolioAsset.totalTokenSupply).multipliedBy(100).toFormat(2);
        return <Modal visible={changeRequest !== undefined}
            onCancel={this.props.closeChangeRequestModal}
            footer={[
                <div key="back" onClick={this.props.closeChangeRequestModal} className="text-primary align-left clickable"><Icon type="arrow-left" /> Back</div>
            ]}>
            <Row>
              <div className="header-titles header-titles-no-sub">
                { changeRequest && <h1 className="font-18">
                    {changeRequest.portfolioAsset.tokenCode} {this.props.changeRequestTypes[changeRequest.category]}
                </h1> }
              </div>
              <div style={{marginTop: 3}}>
                <Tag color="#2db7f5">{changeRequest && this.props.changeRequestStatuses[changeRequest.status]}</Tag> <span style={{fontSize: 12, color: '#eee'}}><strong>Created</strong> <Moment format="ll">{createdDate}</Moment></span>
              </div>
            </Row>
            <br />
            <p className="stat-title">Vote ID</p>
            <span className="text-primary">
                  { changeRequest && changeRequest.voteID }
            </span>
            <p className="stat-title">Created by</p>
            <p className="stat-body">{changeRequest && changeRequest.creator}</p>

            <br />
            <br />

            <div className="text-primary align-center">
                <p className="stat-body">Current votes</p>
                <strong className="font-36">
                    { changeRequest && <React.Fragment>
                        <span className="text-danger">{numVotesPercentage && numVotesPercentage.toFormat(4)}%</span> / {totalVotesRequiredPercentage}%
                    </React.Fragment> }
                </strong>
                {changeRequest && <p><strong>{convertFromSolidityAndFormatForDisplay(numVotes, 0)}</strong> of {convertFromSolidityAndFormatForDisplay(minVotes, 0)} required</p> }
            </div>

            <br />

            <p className="font-12">
                Please visit the BitCar Telegram group and filter by the above transaction hash for discussion on this change request: <a href={BITCAR_TELEGRAM} target="_blank">{BITCAR_TELEGRAM}</a>
            </p>

            <br />
            {changeRequest && <p className="align-center">----- {changeRequest.portfolioAsset.tokenCode} fractions available: -.-% voting power.</p> }
            { !userHasVoted && <Card className="dash-stat-card">
                <Row>
                    <Col span={18}>
                        {changeRequest && <p className="text-primary">I am aware that voting with my {changeRequest.portfolioAsset.tokenCode} fractions will 
                        lock the tokens representing my proof of ownership and prevent them from being transferred until this change request has completed 
                        or expired. You can cancel your vote at any time after voting.</p> }
                    </Col>
                    <Col span={6}>
                        <Checkbox className="register-check pull-right" onChange={this.onCheckboxClick}>I Agree</Checkbox>
                    </Col>
                </Row>
            </Card> }
            { changeRequest && <div className="align-center">
                {!userHasVoted && <Button disabled={!this.state.termsAgreed} onClick={this.handleVote}>
                    Vote for Request
                </Button> }
                {userHasVoted && <Button onClick={this.handleUnVote}>
                    Unvote for Request
                </Button> }
            </div> }
        </Modal>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      web3: state.UIstate.web3
    }
  }
export default connect(mapStateToProps)(ChangeRequestModal);