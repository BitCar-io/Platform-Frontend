import React from "react";
import { Row, Col, Card, Progress, Icon } from "antd";
import { ipfsUrl } from '../../util/helpers';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { URL_ASSET } from "../../util/platformNavigation";

const AssetCard = (props) => {
  const isReleased = new Date().getTime() >= props.car.approvalDate.getTime();
  const isAssetAvailable = props.carBalance.percentUsed < 100;
  const assetImage = props.car.data.garageImage ? props.car.data.garageImage : props.car.data.primaryImage;
  return <Link to={URL_ASSET + props.car.address}>
    <Card className={'car-card ' + (isAssetAvailable ? "open" : "closed")} bordered={false} hoverable={true} style={{ backgroundImage: 'url(' + ipfsUrl + assetImage +')' }}>
      <Row>
        <Col xs={24} xxl={{ span: 7, offset: 1 }} style={{ textAlign: "left" }}>
          <h1 className="car-title">
            <span className="car-year">{props.car.data.year + " "}</span>
            <span className="car-make">{props.car.data.make + " "}</span>
            <span className="car-year">{props.car.data.model}</span>
          </h1>
        </Col>
        <Col xs={24} lg={{ span: 10, offset: 7}} xxl={{ span: 6, offset: 9}}>
          {isAssetAvailable && (
              <div>
                <h1 className="car-price"><span className="currency">USD </span>{props.car.listedValueUsdDisplay}</h1>
                <p className="car-token-code">Code: {props.car.tokenCode}</p>
                {isReleased && <React.Fragment><p style={{fontSize: 16, marginBottom: 0, textAlign: 'right'}}>{props.carBalance.qtySoldDisplay} / {props.car.totalTokenSupplyDisplay} fractions sold</p>
                <Progress percent={props.carBalance.percentUsed} strokeLinecap="square" showInfo={false} strokeColor="#f6a821" />
                {/* <p className="progress-title" style={{marginBottom: 0}}>{props.carBalance.percentRemaining}% remaining</p> */}
                </React.Fragment>}
                {!isReleased && <div className="availability-banner background-info">AVAILABLE <Moment format="ll">{props.car.approvalDate}</Moment></div>}
              </div>
            )}
            {!isAssetAvailable && (
              <div>
                <h1 className="car-price">OFFER COMPLETE</h1>
              </div>
            )}
        </Col>
      </Row>
    </Card>
  </Link>
};
export default AssetCard;
