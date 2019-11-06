import React from 'react';
import { connect } from 'react-redux';
import PortfolioCard from './PortfolioCard';
import { doStringsMatchIgnoringCase } from '../../util/helpers';
import * as _ from 'lodash';

class AgentListingContainer extends React.Component {
    componentDidMount() {
        // console.log('agent listing loadedAssets', this.props.loadedAssets);
        
    }
    render() {
        return <React.Fragment>
            { this.props.coinbase && _.map(this.props.unapprovedAssets, (asset, i) => {
                return <PortfolioCard key={i} asset={asset} approved={false} portfolioType={'agent'} assetBalance={this.props.assetBalances[asset.address]} /> 
            })}

            { this.props.coinbase && _.map(this.props.loadedAssets, (asset, i) => {
                const released = asset.approvalDate && new Date().getTime() > asset.approvalDate.getTime() ? true : false;
                if (doStringsMatchIgnoringCase(asset.agent, this.props.coinbase)) return <PortfolioCard key={i} released={released} asset={asset} approved={true} portfolioType={'agent'} assetBalance={this.props.assetBalances[asset.address]} />
            })}
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      currentUser: state.UIstate.currentUser,
      loadedAssets: state.AssetState.loadedAssets,
      unapprovedAssets: state.AssetState.unapprovedAssets,
      assetBalances: state.PlatformEvent.assetBalances
    }
  }
export default connect(mapStateToProps)(AgentListingContainer);