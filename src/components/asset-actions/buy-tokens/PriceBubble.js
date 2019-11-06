import React from "react";
import PropTypes from 'prop-types';
import { Col, Row } from "antd";

const PriceBubble = (props) => {
    return <Col span={10} className="price-bubble">
                <div className="font-16 text-header-font">
                    {props.header}
                </div>
                <Row>
                    <Col span={24}>
                        <div className="font-30 text-header-font">
                            {props.image} {props.amountToPay}
                        </div>
                        <div className="usd-display">
                            (USD ${props.amountInUsd})
                        </div>
                    </Col>
                </Row>
                {props.currentBalance && props.hasCorrectBalance === true && <Row>
                    <Col span={24} className="current-balance">
                        Current Balance: {props.currentBalance}
                    </Col>
                </Row>}
                {props.currentBalance && props.hasCorrectBalance === false && <Row>
                    <Col span={24} className="current-balance balance-alert">
                        Current Balance ({props.currentBalance}) is too low
                    </Col>
                </Row>}
            </Col>
}

PriceBubble.propTypes = {
    header: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
    amountToPay: PropTypes.string.isRequired,
    amountInUsd: PropTypes.string.isRequired,
    currentBalance: PropTypes.string,
    hasCorrectBalance: PropTypes.bool
};

export default PriceBubble;