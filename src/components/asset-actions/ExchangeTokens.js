import React from 'react';
import PropTypes from 'prop-types';
import { URL_BAZAAR } from '../../util/platformNavigation';
import LinkTooltip from '../LinkTooltip';
import { Icon, Tooltip } from 'antd';

const ExchangeTokens = (props) => {
    return (
        <Tooltip placement="bottom" title="Buy and Sell tokens in our BitCar Bazaar">
            <a href={`${URL_BAZAAR}${props.assetAddress}`} target="_blank">
                <Icon type="stock" className={props.isExchangeAllowed ? "portfolio-icon" : "portfolio-icon-disabled"} />
            </a>
        </Tooltip>
    );
}

ExchangeTokens.propTypes = {
    assetAddress: PropTypes.string.isRequired,
    isExchangeAllowed: PropTypes.bool
};

ExchangeTokens.defaultProps = {
    isExchangeAllowed: false
}

export default ExchangeTokens;