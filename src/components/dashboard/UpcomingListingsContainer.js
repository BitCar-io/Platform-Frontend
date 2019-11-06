import React from "react";
import { connect } from 'react-redux';
import PortfolioCard from './PortfolioCard';
import * as _ from 'lodash';

class UpcomingListingsContainer extends React.Component {
  render() {
    return <React.Fragment>
        { _.map(this.props.loadedAssets, (asset, i) => {
            let currentTime = new Date().getTime();
            let approvalTime = asset.approvalDate.getTime();
            if (currentTime < approvalTime) return <PortfolioCard key={i} asset={asset} approved={true} released={false} />
        })}
    </React.Fragment>
  }
}
const mapStateToProps = (state) => {
  return {
    loadedAssets: state.AssetState.loadedAssets
  }
}
export default connect(mapStateToProps)(UpcomingListingsContainer);