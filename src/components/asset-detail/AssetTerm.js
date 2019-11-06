import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { secondsToYearsString } from '../../util/helpers';
import {Row, Col } from 'antd';

const AssetTerm = (props) => (
    
    <div className="font-22" style={{marginBottom: 5}}>
        {/* {console.log('asset tradingEndDate', props.asset.tradingEndDate)} */}
        {!props.released && 
            <Row>
                <Col xl={{span:8, offset:8}}>
                    <div className="availability-banner background-info">
                        AVAILABLE <Moment format="ll">{props.asset.approvalDate}</Moment>
                    </div>
                </Col>
            </Row>
        }
        <span className="text-sub-headline-font">
            <span className="text-white">Trading ends: </span> 
            <Moment format="ll">{props.asset.tradingEndDate}</Moment>
        </span>
        <br />
        {props.released && 
            <span className="font-14" style={{paddingRight: 15}}>
                <span className="text-white">Listed: </span> 
                <Moment format="ll">{props.asset.approvalDate}</Moment>
            </span>
        }
        <span className="font-14">
            <span className="text-white">Term: </span>
            {secondsToYearsString(props.asset.tradingPeriodDuration)}
        </span>
    </div>
);

AssetTerm.propTypes = {
    asset: PropTypes.object.isRequired,
    released: PropTypes.bool.isRequired
  };

export default AssetTerm;
