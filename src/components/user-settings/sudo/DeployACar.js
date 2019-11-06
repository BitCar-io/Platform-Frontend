import React from 'react';
import { createToken } from '../../../util/assetHelpers';
import { retrieveAssetContract, agentCreateAndSetHash, createTokenFeeManagerAndWhitelist } from '../../../util/adminAssetHelpers';

const tokenName = "Ferrari 599 GTO 1";
const tokenCode = "599GTO1";
const dataHash = carDataHashes.ferrari599GT;
const minimumPurchaseAmount = 25;
const ownershipLock = 95;
const bitcarPercent = 20;
const launchDelaySeconds = 30;
const salePrice = 561000;
const tradingPeriodSeconds = yearsToSeconds(5);
const votingPeriodSeconds = daysToSeconds(30);
const numberOfExtensions = 1;
const purchaseLimitPeriodSeconds = daysToSeconds(1);
const userPeriodLimitBronze = 5000;
const userPeriodLimitSilver = 20000;
const userPeriodLimitGold = salePrice;
const membershipPeriodLimitBronze = salePrice;
const membershipPeriodLimitSilver = salePrice;
const membershipPeriodLimitGold = salePrice;
const escrowPercent = 15;
const msiPercent = 0;
const pafPercent = 0;
const ptfPercent = 0;

const assetSuccessfulVotePercent = 90;
const assetMinimumTokensBeforeVotingPercent = 75;
const assetVotePeriodSeconds = daysToSeconds(21);

// set this!!
const agentAddress = '';

const assetContractaddress = '';

class DeployACar extends React.Component {

    agentSetHash = () => {
        await agentCreateAndSetHash(this.props.web3, tokenName, tokenCode, this.props.coinbase, dataHash);
    }

    adminCreate = () => {
        let asset = await retrieveAssetContract(assetContractaddress, tokenCode, this.props.web3);
        await createTokenFeeManagerAndWhitelist(this.props.web3, asset, this.props.coinbase, tokenName, salePrice, msiPercent, bitcarPercent, tradingPeriodSeconds, votingPeriodSeconds, ownershipLock, numberOfExtensions, escrowPercent, pafPercent, ptfPercent);
    }

    adminCreateBallot = () => {
        let assetControlBallotContract = await createAssetBallot(asset, assetMinimumTokensBeforeVotingPercent, assetSuccessfulVotePercent, assetVotePeriodSeconds, admin0);
        await createAssetBallotCategory(assetControlBallotContract, "Change Storage Location", 90, admin0);
        await createAssetBallotCategory(assetControlBallotContract, "Temporary Display", 75, admin0);
        await createAssetBallotCategory(assetControlBallotContract, "Other", 90, admin0);
    }

    
    render() {
        return <React.Fragment>
            <h1>Admin Configuration</h1>
            <br />
            <AdminWhitelistChecker />
            <hr />
            {/* <Row>
            <h3>User Whitelist</h3>
            <Table dataSource={data} className="admin-config-whitelist-table">
                <Column
                    title="Address"
                    dataIndex="address"
                    key="address"
                />
                <Column
                    title="Country"
                    dataIndex="country"
                    key="country"
                />
                <Column
                    title="Code"
                    dataIndex="code"
                    key="code"
                />
            </Table>
            </Row> */}
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
  return {
    isPending: state.UIstate.isPending,
    web3: state.UIstate.web3,
    coinbase: state.UIstate.coinbase,
    contracts: state.UIstate.contracts,
    currentUser: state.UIstate.currentUser
  }
}
export default connect(mapStateToProps)(AdminConfig);