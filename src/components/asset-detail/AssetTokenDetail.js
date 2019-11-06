import React from 'react';
import PropTypes from 'prop-types';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import { ipfsUrl } from "../../util/helpers";

const AssetTokenDetail = (props) => (
    <div className="asset-token-detail">
        <span>Car Contract Address: </span>
        <span>{props.assetTokenContractAddress ? <BlockchainAddressToolTip trimAddress={true} showTitle={false} address={props.assetTokenContractAddress} symbol={props.tokenCode} imageUrl={ipfsUrl + props.tokenImageHash} /> : "UNAVAILABLE"} </span>
    </div>
);

AssetTokenDetail.propTypes = {
    assetTokenContractAddress: PropTypes.string,
    tokenCode: PropTypes.string.isRequired
  };

export default AssetTokenDetail;