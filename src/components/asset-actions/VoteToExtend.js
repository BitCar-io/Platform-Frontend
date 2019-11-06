import React from 'react';
import PropTypes from 'prop-types';
import { URL_EXTENSION_VOTING } from '../../util/platformNavigation';
import LinkTooltip from '../LinkTooltip';

const VoteToExtend = (props) => {
    const tooltipText = "Vote to extend the car (instead of liquidating it)" + (props.isExtendingAllowed ? "" : " - this option will become available once the car has reached the end of its term and the voting period starts.");
    return <LinkTooltip isLinkEnabled={props.isExtendingAllowed} linkPath={`${URL_EXTENSION_VOTING}${props.assetAddress}`} tooltipText={tooltipText}>
        <i className={`fas fa-clock ${props.isExtendingAllowed ? "portfolio-icon" : "portfolio-icon-disabled"}`}></i>
    </LinkTooltip>;
}

VoteToExtend.propTypes = {
    assetAddress: PropTypes.string.isRequired,
    isExtendingAllowed: PropTypes.bool
};

VoteToExtend.defaultProps = {
    isExtendingAllowed: false
}

export default VoteToExtend;