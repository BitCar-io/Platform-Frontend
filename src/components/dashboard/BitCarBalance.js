import React from 'react';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import { BITCAR_SHIELD_IMAGE } from '../../util/globalVariables';
import AddTokenToMetaMask from '../AddTokenToMetaMask';

const BitCarBalance = props => {
    return props.platformTokenAddress && props.balance && <React.Fragment>
        <div className="bitcar-wrapper">
            <span className="text-brand-main">BitCar in unlocked wallet: </span> 
            <span className="text-brighter">{props.balance}</span>
            <span style={{marginLeft: 10}}><AddTokenToMetaMask address={props.platformTokenAddress} showMetaMaskText={false} symbol='BITCAR' imageUrl={BITCAR_SHIELD_IMAGE} /></span>
        </div>
    </React.Fragment> || '';
}
export default BitCarBalance;