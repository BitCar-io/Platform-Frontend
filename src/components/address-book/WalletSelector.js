import React from 'react';
import { Form, Select, Tag, Tooltip, Icon } from 'antd';
import LinkToEtherScan from '../LinkToEtherScan';
import { ETHGATEWAY, COLD_WALLET_TEXT } from '../../util/globalVariables';
import styleVars from '../../style/variables.scss';
import { HotWalletIcon, ColdWalletIcon } from '../WalletIcons';

const WalletSelector = (props) => (
    <Form.Item name={props.name} style={{marginBottom: 10}}>
        <div className="portfolio-wallets-dropdown">
            <Tooltip placement="bottomRight" title={"Please select a wallet to load your portfolio data. You can only buy using this wallet if you unlock it using " + ETHGATEWAY + "."}>
            {props.getFieldDecorator(props.name, {initialValue: props.defaultWallet})(
                <Select disabled={props.disabled || !props.wallets || props.wallets.length === 0} className="header-portfolio-selector" onChange={props.handleOnChange}>
                {props.wallets.map((wallet, key) =>
                    <Select.Option key={key} value={wallet.address}>
                        {wallet.isCurrent(props.coinbase) ? <Tag color={styleVars.hotwallet}>Current Unlocked <HotWalletIcon colourOverride="white" /></Tag> : ""} {wallet.isStorageAddress ? <Tag color={styleVars.coldwallet}>{COLD_WALLET_TEXT} Address <ColdWalletIcon colourOverride="white" /></Tag> : ""}
                            {wallet.description ? `${wallet.description} - ` : ""} {wallet.address}
                            </Select.Option>
                        )}
                </Select>)}
            </Tooltip>
        </div>
    </Form.Item>
);

export default WalletSelector;