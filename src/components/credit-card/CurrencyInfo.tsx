import React from 'react';
import { Tooltip } from 'antd';

interface IGoogleExchangeRate {
    totalUsd:string;
    currency:string;
}

const GoogleExchangeRate = (props:IGoogleExchangeRate) => {
    return <a href={`${props.totalUsd && `${process.env.GOOGLE_EX_RATE}${props.totalUsd.replace(',', '')}+usd+to+`}${props.currency}`} className="link-highlight" target="_blank">{props.currency}</a>
}

interface ICurrencyInfo {
    totalUsd:number;
    children:any;
}

const CurrencyInfo = (props:ICurrencyInfo) => {

    return <Tooltip title={`This amount is in USD as the platform is built upon the Ethereum cryptocurrency network. During development, it was decided that USD was still the most universally recognised currency. You can view this amount in your own currency using tools such as Google.`}>{props.children}
    {props.totalUsd && <div className="currency-info-link">
        View approximate value in <GoogleExchangeRate currency="GBP" totalUsd={props.totalUsd.toString()} /> or <GoogleExchangeRate currency="EUR" totalUsd={props.totalUsd.toString()} />
    </div>}
    </Tooltip>
}

export default CurrencyInfo;