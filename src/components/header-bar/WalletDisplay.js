import React from "react";
import PropTypes from 'prop-types';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import { Icon } from "antd";

const WalletDisplay = (props) => {
    return (<span className={props.isUnlocked ? "wallet-unlocked" : "wallet-locked"}>
                {props.icon}
                <BlockchainAddressToolTip detail={`${props.walletType} Address - ${props.isUnlocked ? "Unlocked" : "Locked"}`} address={props.address} isToken={false} showAddressText={false} />
                <Icon type={props.isUnlocked ? "unlock" : "lock"} className="wallet-locked-icon" />
            </span>
    )};

WalletDisplay.propTypes = {
    walletType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    icon: PropTypes.object,
    isUnlocked: PropTypes.bool
  };

  WalletDisplay.defaultProps = {
    isUnlocked: false
};

export default WalletDisplay;