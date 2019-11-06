import React from "react";
import { Col, Row } from "antd";
import { JSXElement } from "@babel/types";

interface IPayPalReceiptLine {
    isAlternateRow?: boolean;
    className?:string;
    description: any;
    bitcarPrice:any;
    qty:any;
    totalBitCar:any;
}

const PayPalReceiptLine = (props:IPayPalReceiptLine) => {
    const invoiceItemClass = "invoice-item";

    return <Row className={(props.isAlternateRow ? "alternate-breakdown-row" : "") + (props.className ? props.className : "")}>
        <Col 
            className={invoiceItemClass}
            span={12}>
            {props.description}
        </Col>
        <Col
            className={invoiceItemClass}
            span={4}>
            {props.bitcarPrice}
        </Col>
        <Col 
            className={invoiceItemClass}
            span={4}>
            {props.qty}
        </Col>
        <Col
            className={invoiceItemClass}
            span={4}>
            {props.totalBitCar}
        </Col>
    </Row>
}

export default PayPalReceiptLine;