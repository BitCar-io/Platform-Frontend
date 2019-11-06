import React from 'react';
import { Col, Row, Card } from 'antd';
import { HotWalletIcon, ColdWalletIcon } from '../WalletIcons';
import AddTokenToMetaMask from '../AddTokenToMetaMask';
import { BITCAR_SHIELD_IMAGE } from '../../util/globalVariables';

const { Meta } = Card;

const BalanceDisplay = props => {
    const tradingBalance = props.tradingBalance ? props.tradingBalance : "0.00";
    const storageBalance = props.storageBalance ? props.storageBalance : "0.00";
    
    return (<React.Fragment>
        <Card className="dash-stat-card">
            <Meta
            avatar=
            {
                <React.Fragment>
                    {props.isBitCar && <img src={require('../../logos/bitcar_badge.svg')} className="bitcar-icon" />}
                    {props.isEthereum && <i className="fab fa-ethereum ethereum-icon" />}
                </React.Fragment>
            }
            title=
            {
                <React.Fragment>
                    {props.isBitCar && <React.Fragment>
                            BitCar Balance <AddTokenToMetaMask symbol="BITCAR" address={props.contractAddress} imageUrl={BITCAR_SHIELD_IMAGE} />
                        </React.Fragment>
                    }
                    {props.isEthereum && "Ethereum Balance"}
                </React.Fragment>
            }
            description=
            {
                <React.Fragment>
                    <Row>
                        <HotWalletIcon className="wallet-icon" /> {tradingBalance}
                    </Row>
                    <Row>
                        <ColdWalletIcon className="wallet-icon" /> {storageBalance}
                    </Row>
                </React.Fragment>
            }
            />
        </Card>
    </React.Fragment>);
}
export default BalanceDisplay;