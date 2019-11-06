import React from 'react';
import styleVars from '../style/variables.scss';

// export const ColdWalletIcon = props => <Icon type="usb" theme="twoTone" twoToneColor={props.colourOverride ? props.colourOverride : styleVars.coldwallet} />;

export const ColdWalletIcon = props => <i className={`fas fa-sd-card ${props.className ? props.className : ""}`} style={{color: props.colourOverride ? props.colourOverride : styleVars.coldwallet}} />;

// export const HotWalletIcon = props => <Icon type="fire" theme="twoTone" twoToneColor={props.colourOverride ? props.colourOverride : styleVars.hotwallet} />;

export const HotWalletIcon = props => <i className={`fas fa-car-alt ${props.className ? props.className : ""}`} style={{color: props.colourOverride ? props.colourOverride : styleVars.hotwallet}} />;