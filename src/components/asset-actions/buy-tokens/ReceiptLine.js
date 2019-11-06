import React from "react";
import PropTypes from 'prop-types';
import { Col, Row } from "antd";

const ReceiptLine = (props) => {
    const invoiceItemClass = "invoice-item";

    return <Row className={(props.isAlternateRow ? "alternate-breakdown-row" : "") + (props.className ? props.className : "")}>
        <Col 
            className={invoiceItemClass}
            span={8}>
            {props.description}
        </Col>
        <Col
            className={invoiceItemClass}
            span={4}>
            {props.bitcarPrice}
        </Col>
        <Col
            className={invoiceItemClass}
            span={3}>
            {props.ethPrice}
        </Col>
        <Col 
            className={invoiceItemClass}
            span={3}>
            {props.qty}
        </Col>
        <Col
            className={invoiceItemClass}
            span={3}>
            {props.totalBitCar}
        </Col>
        <Col
            className={invoiceItemClass}
            span={3}>
            {props.totalEth}
        </Col>
    </Row>
}

ReceiptLine.propTypes = {
    description: PropTypes.any,
    bitcarPrice: PropTypes.any,
    ethPrice: PropTypes.any,
    qty: PropTypes.any,
    totalBitCar: PropTypes.any,
    totalEth: PropTypes.any
};

export default ReceiptLine;