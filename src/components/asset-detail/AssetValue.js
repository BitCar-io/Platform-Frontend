import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from "antd";
import { ASSET_AUCTION_LINK } from '../../util/globalVariables';

const AssetValue = (props) => {

    const sothebyUrl = ASSET_AUCTION_LINK[props.loadedAsset.address.toLowerCase()];

    return (

        <React.Fragment>
            <h1 className="spec-price">
                {/* Listed Value<br /> */}
                Available fractions: <span className="spec-title-make">{props.assetBalance.qtyRemainingDisplay}</span>
            </h1>
            <h3 className={"spec-price-appreciation"}>
                <span className={props.loadedAsset.appreciationPercent >= 0 ? 'text-success' : 'text-danger'}>
                
                {+props.loadedAsset.appreciationPercent}%</span> appreciation from new 
                <Tooltip title="This value represents appreciation using the current value and the original list price of this model when it was brand new.">
                    <Icon type="info-circle" />
                </Tooltip>
                {sothebyUrl && <div>
                    <a href={sothebyUrl} target="_blank">View past auctions on Sothebys</a>
                </div>}
            </h3>
        </React.Fragment>
    );
};

AssetValue.propTypes = {
    loadedAsset: PropTypes.object.isRequired,
    assetBalance: PropTypes.object.isRequired
  };

export default AssetValue;