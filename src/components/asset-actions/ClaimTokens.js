import React from 'react';
import PropTypes from 'prop-types';
import { URL_CLAIM_CAR_FUNDS } from '../../util/platformNavigation';
import LinkTooltip from '../LinkTooltip';

const ClaimTokens = (props) => {
    const tooltipText = "Claim funds from liquidated car and escrow" + (props.isClaimingAllowed ? "" : " - this option will become available once the car has been liquidated.");
    return <LinkTooltip isLinkEnabled={props.isClaimingAllowed} linkPath={`${URL_CLAIM_CAR_FUNDS}${props.assetAddress}`} tooltipText={tooltipText}>
        <i className={`fas fa-hand-holding-usd ${props.isClaimingAllowed ? "portfolio-icon" : "portfolio-icon-disabled"}`}></i>
    </LinkTooltip>;
}

ClaimTokens.propTypes = {
    assetAddress: PropTypes.string.isRequired,
    isClaimingAllowed: PropTypes.bool
};

ClaimTokens.defaultProps = {
    isClaimingAllowed: false
}

export default ClaimTokens;