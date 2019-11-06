import React, { Component } from "react";
import { Card, Row, Col } from "antd";
import { connect } from 'react-redux';
import AssetImages from './AssetImages';
import AssetData from './AssetData';
import AssetTokenStatus from './AssetTokenStatus';
import AssetValue from "./AssetValue";
import PageNotFound from "../error-pages/PageNotFound";
import BuyTokenModal from "../asset-actions/buy-tokens/BuyTokenModal.js";
import AssetUnapprovedDetails from "./AssetUnapprovedDetails";
import {convertFromSolidityAndFormatForDisplay, daysToSeconds, yearsToSeconds, scrollToTop} from '../../util/helpers';
import { assetApprovalState, createToken } from '../../util/assetHelpers';
import LoadingIndicator from "../LoadingIndicator";
import AssetWhitelist from "./AssetWhitelist";
import { setDocumentTitle } from '../../util/helpers';
import { callEthereumMethod } from "../../util/web3/web3Wrapper";
import AssetSupportingDocs from "./AssetSupportingDocs";
import Markdown from 'markdown-to-jsx';

import LoadingComponent from "../LoadingComponent";
const bitcar_logo = require('../../logos/logo_bitcar.png');

class AssetDetailsContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      assetAddress: props.match.params.id,
      agentBitcarBalance: undefined,
      isInUpperWave: undefined,
      claimsEnabled: undefined,
      isLoading: true
    }
  }

  componentDidMount = async () => {
    scrollToTop(); // force scroll to top of screen
    let loadedAsset = this.props.loadedAssets[this.state.assetAddress];

    if(!loadedAsset && this.props.unapprovedAssets) {
      loadedAsset = this.props.unapprovedAssets[this.state.assetAddress];
    } else {

      if(!loadedAsset) {
          return;
      }

      // check claimsEnabled first
      const claimsEnabled = loadedAsset && await callEthereumMethod(loadedAsset.assetTokenContract.methods.claimsEnabled());
      
      let isInUpperWave = undefined;
      if (!claimsEnabled) {
        // check if asset is in upperwave / vote / claim
        isInUpperWave = await callEthereumMethod(loadedAsset.assetTokenContract.methods.isInUpperWave());
      }

      this.setState({isLoading: false, isInUpperWave: isInUpperWave, claimsEnabled: claimsEnabled });
    }

    const documentTitle = loadedAsset && loadedAsset.data ? `${loadedAsset.data.year} ${loadedAsset.data.make} ${loadedAsset.data.model}` : 'Car Details';
    setDocumentTitle(documentTitle);

  }

  getAgentBitCarBalance = async (loadedAsset) => {
    if(loadedAsset && !loadedAsset.isLive && this.props.currentUser && this.props.currentUser.isAdmin && !loadedAsset.approvalDate) {
      callEthereumMethod(this.props.platformTokenContract.methods.balanceOf(loadedAsset.agent)).then(result => this.setState({ agentBitcarBalance: convertFromSolidityAndFormatForDisplay(result, 0) }));
    }
  }

  approveAsset = async (loadedAsset) => {

    if(this.props.currentUser.isAdmin) {
      this.processAdminApproval(loadedAsset);
    } else if(this.props.currentUser.isAgent) {
      this.processAgentApproval(loadedAsset);
    }
    
  }

  rejectAsset = async (loadedAsset) => {

    if(this.props.currentUser.isAdmin) {
      this.processAdminRejection(loadedAsset);
    } else if(this.props.currentUser.isAgent) {
      this.processAgentRejection(loadedAsset);
    }
    
  }

  processAdminApproval = async (loadedAsset) =>{
    // console.log('approving asset');

    const adminUserAddress = this.props.coinbase;

    if(!loadedAsset) {
      console.error("Loaded asset not in state!!!");
      return;
    }

    const listPrice = 1000000;
    const msiPerYear = 3000;
    const escrowPercent = 8;
    const pafPercent = 0;
    const bitcarPaymentPercent = 20;
    const tradingTimeSeconds = yearsToSeconds(5);
    const votingTimeSeconds = daysToSeconds(30);
    const approvalDeltaSec = daysToSeconds(14);

    await createToken(loadedAsset.assetContract, adminUserAddress, "TOKENCODEHERE", listPrice, msiPerYear, escrowPercent, pafPercent, bitcarPaymentPercent, tradingTimeSeconds, votingTimeSeconds);

    console.log("*** PAY STEP *** Whitelist Creation");
    await loadedAsset.assetContract.methods.createWhitelist().send({from: adminUserAddress});

    console.log(`*** FINAL PAY STEP *** Completing Admin data approval, with delta (seconds): ${approvalDeltaSec}`);
    await loadedAsset.assetContract.methods.adminApproveData(true, approvalDeltaSec).send({from: adminUserAddress});

    console.log(`Adim has approved asset!`);
    // const buyAllowed = await callEthereumMethod(loadedAsset.assetTokenContract.methods.isActivated());
    // if (buyAllowed) return;

    // const approvalTime = Math.round(new Date().getTime()/1000) + 500;
    // // console.log(`Approving asset for buying at ${new Date(approvalTime * 1000).toString()}, time now:`, new Date().toString());
    // await loadedAsset.assetContract.methods.approve(approvalTime).send({ from: this.props.coinbase });
  }

  processAgentApproval = async (loadedAsset) => {

    if(!loadedAsset) {
      console.error("Loaded asset not in state!!!");
      return;
    }

    if(loadedAsset.approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL) {
      await loadedAsset.assetContract.methods.agentApproveData("").send({from: this.props.coinbase});
    } else {
      await loadedAsset.assetContract.methods.approveContractCreation(true).send({from: this.props.coinbase});
    }
  }

  processAdminRejection = async (loadedAsset) => {

    if(!loadedAsset) {
      console.error("Loaded asset not in state!!!");
      return;
    }

    await loadedAsset.assetContract.methods.adminApproveData(false, 1).send({from: this.props.coinbase});
  }

  processAgentRejection = async (loadedAsset) => {

    if(!loadedAsset) {
      console.error("Loaded asset not in state!!!");
      return;
    }
      await loadedAsset.assetContract.methods.approveContractCreation(false).send({from: this.props.coinbase});
  }

  render() {
    const baseAsset = this.props.allAssets[this.state.assetAddress];
    if(!baseAsset || !this.props.currentUser || (!this.props.currentUser.canAccessAsset(baseAsset))) {
        // console.log(`Base Asset for ${this.state.assetAddress} not found. AllAssets:`, this.props.allAssets);
        return <PageNotFound />
    } else if (!this.props.loadedAssets || (!baseAsset.isLive && !this.props.unapprovedAssets)) {
        return <LoadingComponent image={bitcar_logo} text="Loading Car Data, Please Wait" />
    }

    const loadedAsset = baseAsset.approvalState === assetApprovalState.LIVE ? this.props.loadedAssets[baseAsset.address] : this.props.unapprovedAssets[baseAsset.address];
    // console.log('loadedAsset', loadedAsset)
    if(!loadedAsset && !baseAsset.isLive && baseAsset.approvalState === assetApprovalState.LIVE) {
        return <LoadingComponent image={bitcar_logo} text="Car is going live on the Platform, Please Wait" />

    } else if(!loadedAsset) {
        // console.log(`Loaded Asset for ${baseAsset.address} not found Live state:`, baseAsset.isLive);
        // console.log("AllAssets:", this.props.allAssets);
        // console.log("LoadedAssets:", this.props.loadedAssets);
        // console.log("UnApproved Assets:", this.props.loadedAssets);
        return <PageNotFound />
    }

    if (this.props.assetBalances.length == 0) {
        return <LoadingComponent image={bitcar_logo} text="Loading Car Data, Please Wait" />
    }
    
    // causes CPU cycle to climb HIGH  -> need better way   this.getAgentBitCarBalance(loadedAsset);
    const isTickerOnline = this.props.isTickerOnline;
    const assetBalance = this.props.assetBalances[loadedAsset.address];
    const hasTokensAvailable = assetBalance && assetBalance.qtyRemaining > 0;
    const qtyHasErrored = assetBalance && assetBalance.qtyRemaining.isNaN();
    const userAsset = this.props.userAssets ? this.props.userAssets[loadedAsset.address] : undefined;
    const released = loadedAsset.approvalDate && (loadedAsset.approvalDate.getTime() < new Date().getTime()); // TODO update this from date compares
    const thumbnails = loadedAsset.data.thumbnailImages;
    const images = loadedAsset.data.secondaryImages;
    const supportingDocuments = loadedAsset.data.supportingDocuments;
    const isAvailableToBuy = this.state.isInUpperWave && hasTokensAvailable && released;
    const isWalletUnlocked = !(!this.props.currentUser || !this.props.currentUser.coinbase);
    const userCreationPending = this.props.userCreationPending;

    if(!assetBalance) {
        return <LoadingComponent image={bitcar_logo} text="Loading Car Data, Please Wait" />
    }
    
    return (
    <div className="no-print">
        <Row>
        <Col xs={24} xxl={12}>
            <div className="header-titles">
            <h1 className="spec-title">
                <span className="spec-title-make">{loadedAsset.data.make}</span>
                {' ' + loadedAsset.data.model}
            </h1>
            {/* {userAsset && <div className="token-badge pull-left">{userAsset.displayTotalUserBalance} owned</div> } */}
            </div>
        </Col>
        </Row>

        { loadedAsset.isLive === false && <AssetUnapprovedDetails asset={loadedAsset} currentUser={this.props.currentUser} agentBitcarBalance={this.state.agentBitcarBalance} approveAsset={() => this.approveAsset(loadedAsset)} rejectAsset={() => this.rejectAsset(loadedAsset)} />  }
        
        { loadedAsset.isLive && 
        <Row>
            <Card className="dash-stat-card spec-price-card">

            <Col xl={24}>
                <AssetValue loadedAsset={loadedAsset} assetBalance={assetBalance} />
            </Col>
                
            <Col xl={24}>
                {!userCreationPending && !this.state.isLoading && (!this.props.coinbase || this.props.bitcarBalance[this.props.coinbase]) && 
                    (
                        <React.Fragment>
                            {hasTokensAvailable && 
                                (
                                    <React.Fragment>
                                        <BuyTokenModal 
                                            isBuyingAllowed={isAvailableToBuy} 
                                            doesTheCarHaveFractionsAvailable={hasTokensAvailable}
                                            isWalletUnlocked={isWalletUnlocked} 
                                            assetAddress={loadedAsset.address} 
                                            tokenCode={loadedAsset.tokenCode} 
                                            useIcon={false} 
                                        />
                                    </React.Fragment>
                                ) 
                                ||
                                (
                                    !qtyHasErrored && 
                                        <h2 className="all-tokens-sold">All fractions of the car have been purchased</h2>
                                )
                                || 
                                <h3 className="all-tokens-sold">There was an error retrieving the current balance of the car, please try again.</h3>
                            }
                            {/* <Link to={'/buy-asset-tokens/' + loadedCar.tokenCode}> */}
                            {/* <Button className="text-sub-headline-font font-22">Vote to extend</Button> */}
                            { this.state.claimsEnabled && <h1>Claiming coming soon</h1> }
                            { this.state.claimsEnabled === false && this.state.isInUpperWave === false && <h1>Voting coming soon</h1> }
                        </React.Fragment>
                    ) 
                    || 
                    <LoadingIndicator />
                }
                </Col>
            </Card>

        <Col xl={{span:24}}>
            { assetBalance && <AssetTokenStatus isTickerOnline={isTickerOnline} loadedAsset={loadedAsset} assetBalance={assetBalance} userAsset={userAsset} /> }
        </Col>
        </Row> }

            <Row>
                <AssetImages images={images} thumbnails={thumbnails} />
            </Row>
            <Row>
                <Col span={24}>
                <AssetData data={loadedAsset.data} agent={loadedAsset.agent} />
                </Col>
            </Row>
            {loadedAsset.approvalDate && supportingDocuments && <Row>
                <Col span={24}>
                <AssetSupportingDocs supportingDocuments={supportingDocuments} />
                </Col>
            </Row>}
            <Row>
                <Col span={24}>
                <div className="card-heading">Car Overview</div>
                <Card className="dash-stat-card dash-stat-card-description">
                    {loadedAsset.data.carDescription && <Markdown>{loadedAsset.data.carDescription}</Markdown>}
                    {loadedAsset.data.factoryExtras && <React.Fragment>
                    <br />
                    <Markdown>{loadedAsset.data.factoryExtras}</Markdown>
                    </React.Fragment>
                    }
                </Card>
                </Col>
            </Row>
        {/* <Row gutter={16} className="spec-row transaction-history">
            <Col span={12}>
            <AssetHistory assetTokenAddress={loadedAsset.assetTokenContractAddress} />
            </Col>
        </Row> */}
        <Row className="spec-row transaction-history">
            <Col span={12}>
                <AssetWhitelist asset={loadedAsset} />
            </Col>
        </Row>
    </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allAssets: state.AssetState.allAssets,
    loadedAssets: state.AssetState.loadedAssets,
    unapprovedAssets: state.AssetState.unapprovedAssets,
    bitcarBalance: state.UserState.bitcarBalance,
    currentUser: state.UIstate.currentUser,
    userCreationPending: state.UIstate.userCreationPending,
    coinbase: state.UIstate.coinbase,
    assetBalances: state.PlatformEvent.assetBalances,
    userAssets: state.UserState.portfolioAssets,
    bitcarUsd: state.PlatformEvent.bitcarUsd,
    isTickerOnline: state.PlatformEvent.isTickerOnline,
    platformTokenContract: state.UIstate.platformTokenContract
  }
}
export default connect(mapStateToProps)(AssetDetailsContainer);
