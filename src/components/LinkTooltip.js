import React from 'react';
import { Tooltip } from 'antd';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const LinkTooltip = props => {
    if (props.isLinkEnabled) {
        return (
            <Tooltip placement="bottom" title={props.tooltipText}>
                <a href={props.linkPath}>{props.children}</a>
            </Tooltip>
        );
    }

    return (
        <Tooltip placement="bottom" title={props.tooltipText}>
            <a>{props.children}</a>
        </Tooltip>
    );
};

LinkTooltip.propTypes = {
    tooltipText: PropTypes.string.isRequired,
    linkPath: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
};

LinkTooltip.defaultProps = {
    showMetaMaskText: false,
    isLinkEnabled: true
};

export default LinkTooltip;