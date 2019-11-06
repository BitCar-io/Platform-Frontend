import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Badge } from 'antd';

const BuyIcon = (props) => {
    const icon = <Tooltip placement="bottom" title={props.tooltipText}>
        <Icon type="shopping-cart" onClick={props.onIconClick} className={`${props.isBuyingAllowed ? "portfolio-icon" : "portfolio-icon-disabled"}`} />
    </Tooltip>;
    if(props.isBuyingAllowed) {
        return icon;
    } else {
        return <Badge count={<Icon type="exclamation-circle" theme="filled" className="portfolio-icon-badge" />}>
            {icon}
        </Badge>
    }
}

BuyIcon.propTypes = {
    tooltipText: PropTypes.string.isRequired,
    onIconClick: PropTypes.func,
    isBuyingAllowed: PropTypes.bool
};

BuyIcon.defaultProps = {
    isBuyingAllowed: false
}

export default BuyIcon;