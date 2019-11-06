import React from 'react';
import { Card, Col, Progress, Row } from "antd";
import { DISPLAY_DECIMALS_USD, ESCROW_TEXT } from '../../util/globalVariables';

import { secondsToYearsString } from '../../util/helpers';
import Moment from 'react-moment';

import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import { ipfsUrl } from "../../util/helpers";

const AssetTokenStatus = (props) => {
    return ( 
        <Card className="dash-stat-card">
            <Row>
                <Col md={{span:11}} xl={{span:11}}>
                    <ul className="car-info">
                        <li>Token Code: <span className="car-info-data">{props.loadedAsset.tokenCode}</span></li>
                        <li>Token Address: 
                            <span className="car-info-data">
                                <span>{props.loadedAsset.assetTokenContractAddress ? <BlockchainAddressToolTip showEthereumBtn={false} showMetaMaskBtn={false} trimAddress={true} showTitle={false} address={props.loadedAsset.assetTokenContractAddress} symbol={props.loadedAsset.tokenCode} imageUrl={ipfsUrl + props.loadedAsset.data.thumbnailImages[0]} /> : "UNAVAILABLE"} </span>
                            </span>
                        </li>
                        <li>Total Fractions: <span className="car-info-data">{props.assetBalance.totalTokenSupplyDisplay}</span></li>
                        <li>Fractions Remaining: <span className="car-info-data">{props.assetBalance.qtyRemainingDisplay}</span></li>
                    </ul>
                </Col>
                <Col md={{span:11, offset: 1}} xl={{span:11, offset: 1}}>
                    <ul className="car-info">
                        <li>Total BitCar in escrow: <span className="car-info-data">{props.assetBalance.escrowAmountDisplay}</span></li>
                        <li>Listing date: <span className="car-info-data"><Moment format="ll">{props.loadedAsset.approvalDate}</Moment></span></li>
                        <li>Trading end date: <span className="car-info-data"><Moment format="ll">{props.loadedAsset.tradingEndDate}</Moment></span></li>
                        <li>Term: <span className="car-info-data">{secondsToYearsString(props.loadedAsset.tradingPeriodDuration)}</span></li>
                    </ul>
                </Col>
            </Row>
        </Card> );
};

export default AssetTokenStatus;
