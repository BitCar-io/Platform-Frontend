import React from "react";
import AssetDetailsContainer from "../asset-detail/AssetDetailsContainer.js";
import AssetList from "../asset-listing/AssetList";
import { Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { URL_ASSET } from "../../util/platformNavigation.js";

import LoadingComponent from "../LoadingComponent";
const bitcar_logo = require('../../logos/logo_bitcar.png');

class AssetsContainer extends React.Component {
    render() {
        if (!this.props.assetContracts) {
            return <LoadingComponent image={bitcar_logo} text="Loading Application Data, Please Wait" />
        } else {
            return <Route path={`${URL_ASSET}:id`} render={(props) => this.props.loadedAssets && <AssetDetailsContainer {...props} />} />;
        }
    }
}
const mapStateToProps = (state) => {
    return {
        allAssets: state.AssetState.allAssets,
        assetContracts: state.AssetState.assetContracts,
        loadedAssets: state.AssetState.loadedAssets
    }
}
export default connect(mapStateToProps)(AssetsContainer);
