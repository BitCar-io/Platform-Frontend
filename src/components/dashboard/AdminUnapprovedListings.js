import React from 'react';
import { connect } from 'react-redux';
import PortfolioCard from './PortfolioCard';
import * as _ from 'lodash';

class AdminUnapprovedListings extends React.Component {
    componentDidMount() {
        //console.log('unapprovedAssets mounted', this.props.unapprovedAssets);
    }
    render() {
        return <React.Fragment>
            { _.map(this.props.unapprovedAssets, (asset, i) => <PortfolioCard key={i} asset={asset} approved={false} portfolioType={'admin'} /> )}
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      currentUser: state.UIstate.currentUser,
      loadedAssets: state.AssetState.loadedAssets,
      unapprovedAssets: state.AssetState.unapprovedAssets
    }
  }
export default connect(mapStateToProps)(AdminUnapprovedListings);