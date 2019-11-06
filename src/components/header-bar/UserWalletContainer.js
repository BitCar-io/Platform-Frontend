import React from "react";
import PropTypes from 'prop-types';
import { Row } from "antd";
import { HOT_WALLET_TEXT, COLD_WALLET_TEXT } from "../../util/globalVariables";
import { ColdWalletIcon, HotWalletIcon } from "../WalletIcons";
import WalletDisplay from "./WalletDisplay";
import { User } from "../../classes/User";

const UserWalletContainer = (props) => {
    const isHotWalletUnlocked = !props.currentUser.hotWallet || props.currentUser.coinbase === props.currentUser.hotWallet;
    const hotDisplayAddress = props.currentUser.hotWallet ? props.currentUser.hotWallet : props.currentUser.coinbase;
    return (
    <div className="wallet-wrapper">
        {props.currentUser.coinbase && <Row style={{marginBottom: 3}}>
            <WalletDisplay icon={props.currentUser.hotWallet ? <HotWalletIcon /> : null} walletType={HOT_WALLET_TEXT} isUnlocked={isHotWalletUnlocked} address={hotDisplayAddress} />
        </Row>}
        {props.currentUser.coldWallet && <Row>
            <WalletDisplay icon={<ColdWalletIcon />} walletType={COLD_WALLET_TEXT} isUnlocked={!isHotWalletUnlocked} address={props.currentUser.coldWallet} />
        </Row>}
    </div>
)};

UserWalletContainer.propTypes = {
    currentUser: PropTypes.instanceOf(User).isRequired
};

export default UserWalletContainer;