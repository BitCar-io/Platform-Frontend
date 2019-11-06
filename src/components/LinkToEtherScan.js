import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { trimAddress } from '../util/helpers';

const nonToken = "address";
const token = "token";

const LinkToEtherScan = (props) => { 
    const displayAddress = props.showAddress ? (props.trimAddress ? trimAddress(props.address) : props.address) : "";

    return (
    <React.Fragment>
        {props.connectedNetwork && props.connectedNetwork.networkDetails && props.connectedNetwork.networkDetails.scanUrl &&
            <React.Fragment>
                {props.showAddress ? `${displayAddress} ` : ""}<a href={`${props.connectedNetwork.networkDetails.scanUrl}${props.isToken ? token : nonToken}/${props.address}`} 
                    target="_blank" title={props.linkTooltip ? props.linkTooltip : "Click to view on EtherScan.io"} rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt"></i>
                </a>
            </React.Fragment>
        }
    </React.Fragment>
)};

LinkToEtherScan.propTypes = {
    address: PropTypes.string.isRequired,
    showAddress: PropTypes.bool,
    trimAddress: PropTypes.bool,
    isToken: PropTypes.bool,
    linkTooltip: PropTypes.string
  };

LinkToEtherScan.defaultProps = {
    isToken: true,
    showAddress: false,
    trimAddress: false
};

const mapStateToProps = (state) => {
    return {
        connectedNetwork: state.UIstate.connectedNetwork
    }
}

export default connect(mapStateToProps)(LinkToEtherScan);