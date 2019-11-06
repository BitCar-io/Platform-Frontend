import React from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, Icon, Alert } from "antd";
import BuyTokens from "./BuyTokens";
import PropTypes from 'prop-types';
import BuyTokensReceipt from './BuyTokensReceipt';
import PurchaseReceipt from '../../../classes/PurchaseReceipt';
import { BUY_BUTTON_TEXT, ETHGATEWAY, LEGAL_ENTITY, BITCAR_ENTITY, COLD_WALLET_TEXT, HOT_WALLET_TEXT } from "../../../util/globalVariables";
import BuyIcon from './BuyIcon';
import MetaMaskNotification from '../../MetaMaskNotification';
import BlockchainTimeEstimateDisplay from '../../BlockchainTimeEstimateDisplay';
import { URL_MEMBERSHIP_REGISTRATION } from "../../../util/platformNavigation";
import Login from "../../header-bar/Login";
import { setInvoiceModalShown } from "../../../actions";
import store from "../../../store";
import { URL_CREDITCARD_PAYMENT } from "../../../util/platformNavigation";
import { Redirect } from "react-router";

class BuyTokenModal extends React.Component {

  // state = {
  //   isVisible: false,
  //   purchaseReceipt: this.props.loadedAssets && new PurchaseReceipt(this.props.web3, {address: "0x67A22B9fD698c3760A974a7C65B9d49Bf6E41252",
  //     blockHash: "0x2bee579051e10c7a2adef8f71790ec99d75f225c917fc06cbbbeff3296717936",
  //     blockNumber: 944,
  //     event: "BoughtAssetTokens",
  //     id: "log_5278b725",
  //     logIndex: 4,
  //     returnValues: {0: "0x5C8498988d8F7BCC96E94fa822a783Ff1B726DB9", 1: "5000000000", 2: "1000000000", 3: "260085000000000000", 4: "750000000", 5: "0", 6: "0", 7: "0",
  //       beeCost: "750000000", costWei: "260085000000000000",
  //       msiCost: "0",
  //       pafCost: "0",
  //       ptfCost: "0",
  //       tokenAmount: "5000000000",
  //       tokenCostBitcar: "1000000000",
  //       user: "0x5C8498988d8F7BCC96E94fa822a783Ff1B726DB9"},
  //     signature: "0x4779751a9f509bf4446c245c69699c0d447eb7eb2e35e27a8850740842881135",
  //     transactionHash: "0x01811035a357ca0912522f4c8c87209ab75775439973e204d53fbb69010d3cfb",
  //     transactionIndex: 0,
  //     type: "mined"}, this.props.loadedAssets['0x589DBe0Ab47FEEce8ceD783e7AeCA11CafDA628e'], new Date(2019,4,29,15,34,25)),
  //   buyStatus: 'complete'
  // }

  state = {
    isVisible: false,
    purchaseReceipt: undefined,
    buyStatus: undefined
  }

  buyStatuses = {
    none: undefined,
    allowance: 'allowance',
    purchase: 'purchase',
    purchaseComplete: 'complete'
  }

  showModal = () => {
    this.setState({ isVisible: true });
    store.dispatch(setInvoiceModalShown(true));
  }
  hideModal = () => {
    this.setState({ isVisible: false, purchaseReceipt: undefined, buyStatus: undefined});
    store.dispatch(setInvoiceModalShown(false));
  }
  setBuyStatus = status => {

    if(status === this.state.buyStatus) {
      return;
    }

    this.setState({ buyStatus: status });
  }
  
  setReceipt = async (boughtAssetEventResponse, loadedAsset) => {

    const transactionTime = new Date();

    const receipt = new PurchaseReceipt(this.props.web3, boughtAssetEventResponse, loadedAsset, transactionTime);
    // console.log("Purchase Receipt", receipt);
    this.setState({purchaseReceipt: receipt});
  }

  componentWillUnmount() {
    store.dispatch(setInvoiceModalShown(false));
  }

  render() {
    const iconMode = this.props.useIcon;
    const asset = this.props.loadedAssets[this.props.assetAddress];
    const assetBalance = this.props.assetBalances[this.props.assetAddress];
    const footer = [ this.state.buyStatus !== this.buyStatuses.purchaseComplete ? <div key="back" className="buy-modal-footer">
      <Row>
        <Col span={6} onClick={this.hideModal} className="clickable">
          <Icon type="left" /> {this.props.returnText ? this.props.returnText : "Back to car overview"}
        </Col>
        <Col span={18}>
          Company details: {LEGAL_ENTITY.entityName}, {LEGAL_ENTITY.registrationNumber}
          <br />
          {LEGAL_ENTITY.addressLine1}, {LEGAL_ENTITY.addressLine2}, {LEGAL_ENTITY.country}
          <br />
          Contact: <a className="link-highlight" href={`mailto:${BITCAR_ENTITY.contactEmail}`}>{BITCAR_ENTITY.contactEmail}</a>
        </Col>
      </Row>
    </div> : <div key="back" onClick={this.hideModal} className="buy-modal-footer clickable"><Icon type="left" /> {this.props.returnText ? this.props.returnText : "Back to car overview"}</div>
    ]
    const assetTitle = asset ? `${asset.data.make} ${asset.data.model} (${asset.tokenCode})` : '';

    if (!asset) {
      return "Asset not found."
    }
    else {

      const warningText = this.props.currentUser && this.props.currentUser.isConnectedWithColdWallet ? `Please change the selected account in MetaMask to your ${HOT_WALLET_TEXT} wallet - you are currently using your ${COLD_WALLET_TEXT} wallet.` :
      this.props.coinbase && (!this.props.currentUser || !this.props.currentUser.isTrader) ? <Link to={URL_MEMBERSHIP_REGISTRATION} className="ant-btn ant-btn-lg">Register to buy</Link>:
      !this.props.isTickerOnline ? "BitCar and Ethereum currency feed is currently offline, so some functionality is unavailable." :
      !this.props.isBuyingAllowed ? "The purchasing period for this car has now ended" :
      !this.props.doesTheCarHaveFractionsAvailable ? "All fractions of this car have been purchased" : null;

      if(warningText !== null) {
        return iconMode ? <BuyIcon tooltipText={warningText} /> : <div className={!this.props.doesTheCarHaveFractionsAvailable ? "all-tokens-sold" : "buy-warning"}>{warningText}</div>
      }

      if(this.props.creditCardBuyNow) {
        return <Redirect push to={URL_CREDITCARD_PAYMENT} />
      }

      return (this.props.loadedAssets && assetBalance && <React.Fragment>
        {!this.props.useIcon && <Button className={this.props.classOverride ? this.props.classOverride : "car-card-action-call buy-tokens-btn"} onClick={this.showModal}>{BUY_BUTTON_TEXT}</Button>}
        {this.props.useIcon && <BuyIcon onIconClick={this.showModal} isBuyingAllowed={true} tooltipText="Buy more fractions of this car" />}

        <Modal visible={this.state.isVisible}
          centered
          className={this.state.purchaseReceipt ? "invoice" : ""}
          onCancel={this.state.buyStatus === undefined || this.state.buyStatus === this.buyStatuses.purchaseComplete ? this.hideModal : null}
          width={this.state.purchaseReceipt ? '75%' : 650}
          closable={ this.state.buyStatus === undefined || this.state.buyStatus === this.buyStatuses.purchaseComplete }
          footer={this.state.buyStatus === undefined || this.state.buyStatus === this.buyStatuses.purchaseComplete ? footer : null}
          destroyOnClose={true}
        >
          <Row className="no-print">
            <i className="pe-7s-cart header-icon" style={{marginBottom: 15}} />
            <div className="header-titles header-titles-no-sub" style={{marginTop: 5}}>
                <h1 className="font-18">{assetTitle}</h1>
            </div>
          </Row>
          { !this.state.purchaseReceipt && <BuyTokens assetTitle={assetTitle} asset={asset} assetBalance={assetBalance} hideModal={this.hideModal} setBuyStatus={this.setBuyStatus} setReceipt={this.setReceipt} buyStatuses={this.buyStatuses} resetState={!this.state.isVisible} /> }
          { this.state.purchaseReceipt && <BuyTokensReceipt loadedAsset={asset} purchaseReceipt={this.state.purchaseReceipt} /> }
          { this.state.buyStatus === "allowance" && <Alert type="warning" className="no-print"
              message="Step 1/2: Setting BitCar allowance"
              description={<span>
                {ETHGATEWAY} will prompt you to grant permission for the application to spend BitCar on your behalf. This is necessary to complete the transaction and does not actually spend any currency except for the gas cost.
                <MetaMaskNotification />
                <BlockchainTimeEstimateDisplay getEstimate={this.state.buyStatus !== this.buyStatuses.none} />
                </span>}
              showIcon 
              /> }
          { this.state.buyStatus === "purchase" && <Alert type="warning" className="no-print"
              message="Step 2/2: Purchasing fractions of the car"
              description={<span>
                Please check {ETHGATEWAY} and approve the transaction to complete your purchase.
                <MetaMaskNotification />
                <BlockchainTimeEstimateDisplay getEstimate={this.state.buyStatus !== this.buyStatuses.none} />
                </span>
              }
              showIcon 
              /> }
        </Modal>
    </React.Fragment>);
    }
  }
}

BuyTokenModal.propTypes = {
  assetAddress: PropTypes.string.isRequired,
  classOverride: PropTypes.string,
  useIcon: PropTypes.bool,
  returnText: PropTypes.string,
  isBuyingAllowed: PropTypes.bool,
  isWalletUnlocked: PropTypes.bool,
  doesTheCarHaveFractionsAvailable: PropTypes.bool
};

BuyTokenModal.defaultProps = {
  useIcon: false
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.UIstate.currentUser,
    loadedAssets: state.AssetState.loadedAssets,
    assetBalances: state.PlatformEvent.assetBalances,
    web3: state.UIstate.web3,
    isTickerOnline: state.PlatformEvent.isTickerOnline,
    isBuyModalOpen: state.UIstate.isBuyModalOpen,
    creditCardBuyNow: state.CreditCardPayment.buyNow
  }
}
export default connect(mapStateToProps)(BuyTokenModal);