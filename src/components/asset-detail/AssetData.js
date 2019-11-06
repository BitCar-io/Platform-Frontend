import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Tooltip } from "antd";
import LinkToEtherScan from '../LinkToEtherScan';

const AssetData = (props) => (
    <div>
        <div className="card-heading">Car Specifics</div>
        <Card className="dash-stat-card car-info-card">
            <Row>
                <Col md={{span:10}} xl={{span:7}}>
                    <ul className="car-info">
                    <li>Production Date: <span className="car-info-data">{props.data.month}/{props.data.year}</span></li>
                    <li>Price New: <span className="car-info-data">{`$${props.data.newPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></li>
                    <li>Current Value: <span className="car-info-data">{`$${props.data.currentValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></li>
                    <li>Chassis No: <span className="car-info-data">{props.data.chassisNumber}</span></li>
                    </ul>
                </Col>
                <Col md={{span:10, offset: 2}} xl={{span:7, offset: 1}}>
                <ul className="car-info">
                    <li>Engine No: <span className="car-info-data">{props.data.engineNo}</span></li>
                    <li>Body No: <span className="car-info-data">{props.data.bodyNo}</span></li>
                    <li>Mileage: <span className="car-info-data">{props.data.odometer} km</span></li>
                    <li>Transmission Type: <span className="car-info-data">{props.data.trans}</span></li>
                </ul>
                </Col>
                <Col md={{span:10}} xl={{span:7, offset: 1}}>
                <ul className="car-info">
                    <li>Location: <span className="car-info-data">{props.data.storageCountry}</span></li>
                    <li>
                        <Tooltip title="This relates to clause 3.16 within the terms and conditions">
                            Agent profit share:
                        </Tooltip>
                        <span className="car-info-data">0%</span>
                    </li>
                    <li>Total Cars Made: <span className="car-info-data">{props.data.totalCarsMade}</span></li>
                    <li>Previous Owners: <span className="car-info-data">{props.data.previousOwners}</span></li>
                </ul>
                </Col>
            </Row>
        </Card>
    </div>
);

AssetData.propTypes = {
    data: PropTypes.object.isRequired
  };

export default AssetData;