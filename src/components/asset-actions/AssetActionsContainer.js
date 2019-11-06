import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageNotFound from "../error-pages/PageNotFound";
import BuyTokenModal from "./buy-tokens/BuyTokenModal.js";
import { assetApprovalState } from '../../util/assetHelpers';
import LoadingIndicator from "../LoadingIndicator";
import { callEthereumMethod } from "../../util/web3/web3Wrapper";
import ClaimTokens from "./ClaimTokens";
import VoteToExtend from "./VoteToExtend";
import ExchangeTokens from "./ExchangeTokens";
import LinkTooltip from "../LinkTooltip";
import { URL_CAR_MANAGEMENT } from "../../util/platformNavigation";

class AssetActionsContainer extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isInUpperWave: undefined,
            claimsEnabled: undefined
        }
    }

    componentWillUnmount = async () => {
        this._isMounted = false;
    }

    componentDidMount = async () => {
        this._isMounted = true;

        let loadedAsset = this.props.loadedAssets[this.props.assetAddress];

        if(!loadedAsset && this.props.unapprovedAssets) {
            loadedAsset = this.props.unapprovedAssets[this.props.assetAddress];
            return;
        }

        // check claimsEnabled first
        const claimsEnabled = loadedAsset && await callEthereumMethod(loadedAsset.assetTokenContract.methods.claimsEnabled());

        let newState = {claimsEnabled: claimsEnabled};

        if (!claimsEnabled) {
            // check if asset is in upperwave / vote / claim
            const isInUpperWave = await callEthereumMethod(loadedAsset.assetTokenContract.methods.isInUpperWave());
            newState.isInUpperWave = isInUpperWave;
        }

        if(this._isMounted) {
            this.setState(newState);
        }
    }

  render() {
    const baseAsset = this.props.allAssets[this.props.assetAddress];
    if (!this.props.loadedAssets || (!baseAsset.isLive && !this.props.unapprovedAssets)) {
      return <LoadingIndicator text="Loading Car Data, Please Wait" />
    } else {
      const loadedAsset = baseAsset.approvalState === assetApprovalState.LIVE ? this.props.loadedAssets[baseAsset.address] : this.props.unapprovedAssets[baseAsset.address];
      // console.log('loadedAsset', loadedAsset)
      if(!loadedAsset && !baseAsset.isLive && baseAsset.approvalState === assetApprovalState.LIVE) {
        return <LoadingIndicator text="Car is going live on the Platform, Please Wait" />
      } else if(!loadedAsset) {
        // console.log(`Loaded Asset for ${baseAsset.address} not found Live state:`, baseAsset.isLive);
        // console.log("AllAssets:", this.props.allAssets);
        // console.log("LoadedAssets:", this.props.loadedAssets);
        // console.log("UnApproved Assets:", this.props.loadedAssets);
        return <PageNotFound />
      }
      else {
       
        const assetBalance = this.props.assetBalances[loadedAsset.address];
        // console.log('assetBalance', assetBalance)
        const hasTokensAvailable = assetBalance && assetBalance.qtyRemaining > 0;
        const userAsset = this.props.userAssets ? this.props.userAssets[loadedAsset.address] : undefined;
        const isWalletUnlocked = !(!this.props.currentUser || !this.props.currentUser.coinbase);
        const userCreationPending = this.props.userCreationPending;
        const useIcons = this.props.useIcons;

        if(userCreationPending) {
          return "";
        } else {
          const isClaimingAllowed = userAsset && this.state.claimsEnabled;
          const isExtendingAllowed = userAsset && !isClaimingAllowed && this.state.isInUpperWave === false;
          const isBuyingAllowed = !isClaimingAllowed && !isExtendingAllowed;
          const buyModal = <BuyTokenModal returnText={this.props.buyModalReturnText} isBuyingAllowed={isBuyingAllowed} doesTheCarHaveFractionsAvailable={hasTokensAvailable} isWalletUnlocked={isWalletUnlocked} assetAddress={loadedAsset.address} tokenCode={loadedAsset.tokenCode} useIcon={useIcons} />
          return (useIcons && <React.Fragment>
            {buyModal}
            <ExchangeTokens assetAddress={loadedAsset.address} isExchangeAllowed={isBuyingAllowed} />
            <LinkTooltip isLinkEnabled={false} linkPath={URL_CAR_MANAGEMENT} tooltipText="Coming soon! - Manage this car by voting on and creating new management requests.">
                <i className="fas fa-users portfolio-icon-disabled" />
            </LinkTooltip>
            <VoteToExtend assetAddress={loadedAsset.address} isExtendingAllowed={isExtendingAllowed} />
            <ClaimTokens assetAddress={loadedAsset.address} isClaimingAllowed={isClaimingAllowed} />
          </React.Fragment>) || (
            <React.Fragment>
              {isBuyingAllowed && buyModal}
              {isClaimingAllowed && <h1>Claiming coming soon</h1>}
              {isExtendingAllowed && <h1>Voting coming soon</h1>}
            </React.Fragment>
          );
        }
      }
    }
  }
}

AssetActionsContainer.propTypes = {
  assetAddress: PropTypes.string.isRequired,
  buyModalReturnText: PropTypes.string,
  useIcons: PropTypes.bool
};

AssetActionsContainer.defaultProps = {
  useIcons: false
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
export default connect(mapStateToProps)(AssetActionsContainer);
