import React from 'react';
import { Alert, Col, Icon, Row } from "antd";
import PropTypes from 'prop-types';
import LoadedAsset from '../../classes/LoadedAsset';
import Fees from '../../classes/Fees';
import MembershipPersonalData from '../../classes/MembershipPersonalData';
import { DISPLAY_DECIMALS_USD, LEGAL_ENTITY } from '../../util/globalVariables';
import Moment from 'react-moment';
import ReceiptLine from '../asset-actions/buy-tokens/ReceiptLine';
import { CarFractionToolTip, CarTokenToolTip, EscrowToolTip } from '../asset-actions/buy-tokens/PaymentBreakdown';
import PayPalReceiptLine from './receipt/ReceiptLine';
import html2canvas from 'html2canvas';

interface ICreditCardReceiptState {
    saveUrl?:string;
}

interface ICreditCardReceiptProps {
    asset:LoadedAsset;
    purchase:Fees;
    purchaseDate:string;
    orderId:string;
    redemptionCode:string;
    user:MembershipPersonalData;
}

class CreditCardReceipt extends React.Component<ICreditCardReceiptProps, ICreditCardReceiptState> {

    constructor(props:ICreditCardReceiptProps) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.createImage();
    }

    print = () => {
        window.print();
        return false;
    }

    createImage = () => {

        // const options = {
        //     windowHeight: 1056,
        //     windowWidth: 715,
        //     width: 735,
        //     height: 1076,
        //     onclone: (clonedDocument:Document) => {
        //         clonedDocument.body.classList.add("save-canvas");

        //         // CSS TESTING PURPOSES ONLY
        //         // document.body.classListy.add("save-canvas");
        //     }
        // }

        // html2canvas(document.body, options).then(canvas => {
        //     const downloadText = document.createTextNode('Download Image');
        //     let downloadLink = document.createElement('a');
        //     downloadLink.appendChild(downloadText);
        //     downloadLink.title = downloadLink.innerHTML;
        //     downloadLink.href = canvas.toDataURL("image/jpeg");

        //     // this.setState({saveUrl: canvas.toDataURL("image/jpeg")});
        //     this.setState({saveUrl: downloadLink});
        // });
        // return false;
    }

    downloadInvoice = () => {

        // const downloadLink = this.state.saveUrl;

        // const iFrameElement = document.createElement('iframe');
        // iFrameElement.appendChild(downloadLink);

        // var win = window.open();

        // if(!win) {
        //     return;
        // }

        // win.document.write('<iframe src="' + this.state.saveUrl  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');

        // const link = win.document.getElementById('download');

        // link.click();

        // win.document.write('<html><head><title>BitCar Invoice</title></head><body><iframe src="' + this.state.saveUrl  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe></body></html>');
        // win.document.write('<iframe src="' + this.state.saveUrl  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        // const downloadLink = this.state.saveUrl;
        // if(!downloadLink) {
        //     return;
        // }

        // document.body.appendChild(downloadLink);
        // downloadLink.click();
        // document.body.removeChild(downloadLink);
    }

    render() {

        const props = this.props;

        const purchase = props.purchase;

        const tokenQty = purchase.tokenQty.toFormat(0);
        const tokenPriceUsd = purchase.tokenQty.toFormat(DISPLAY_DECIMALS_USD);
        const totalPrice = purchase.totalUsd_display;
        const pricePerToken = "1.00";
        const escrowUsd = purchase.displayBEEinUSD;
        const usdBEEPerToken = purchase.totalBEEinUSD.dividedBy(purchase.tokenQty).toFormat(DISPLAY_DECIMALS_USD);

        const user = props.user;
        const asset = props.asset;

        const infoIcon = <Icon className="no-print" type="question-circle" />

        return (
            <React.Fragment>
            <Alert className="no-print" type="success" message={`Successfully purchased ${tokenQty} fractions of the car - your invoice is provided below, please print for your records.`} />
            <br className="no-print" />

            <div id="token-invoice" className="token-invoice">
                <div className="no-print print-icon clickable" onClick={this.print}>
                    <Icon type="printer" /><span>Print</span>
                </div>
                {/* {this.state.saveUrl !== undefined && <a className="no-print print-icon clickable" href={this.state.saveUrl} title="Download"><Icon type="download" /><span>Save</span></a>} */}
                {this.state.saveUrl && <div className="no-print print-icon clickable" onClick={this.downloadInvoice}>
                    <Icon type="download" /><span>Save</span>
                </div>}
                <Alert type="warning" message={<React.Fragment>
                        <div className="redemption-code">Your Redemption code is <span className='code-value'>{props.redemptionCode}</span> and will be required to transfer your digital tokens, please keep it safe.</div><div>This is NOT the same code as your PayPal order Id, but you can use it to find your paypal order in the 'Activity' screen on PayPal. To redeem your tokens, please use the 'Redeem' link <span className="no-screen">in the menu bar and follow the required steps.</span><span className="no-print">and follow the required steps.</span>
                        </div>
                    </React.Fragment>} />
                <br />

                <h1>PURCHASE INVOICE</h1>
                <div className="print-header no-screen">
                    <img src={require("../../logos/logo_bitcar.png")} className="print-logo" alt="bitcar logo" />
                </div>
                <Row>
                    <Col md={24} lg={12}>
                        <div className="business-details">
                            <h2>{LEGAL_ENTITY.entityName}
                            </h2>
                            <h3>{LEGAL_ENTITY.registrationNumber}</h3>
                            <div className="business-address">
                                {LEGAL_ENTITY.addressLine1}
                                <br />
                                {LEGAL_ENTITY.addressLine2}, {LEGAL_ENTITY.country}
                            </div>
                            <div className="contact-details">
                                Email: <a className="underline" href={`mailto:${LEGAL_ENTITY.contactEmail}`}>{LEGAL_ENTITY.contactEmail}</a>
                            </div>
                        </div>
                    </Col>
                    <Col md={24} lg={12}>
                        <div className="purchase-info">
                            <div>
                                Date (UTC): <Moment format="DD MMM YYYY" date={props.purchaseDate}></Moment>
                            </div>
                            <div>
                                Payment fully received
                            </div>
                            <div>
                                PayPal Order Reference:
                            </div>
                            <div className="underline">
                                {props.orderId}
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Col className="invoice-item-separator"></Col>

                <h2>Bill to</h2>
                <div>
                    {user.firstName} {user.lastName}
                    <br />
                    {user.taxAddress && (<React.Fragment>
                        {user.taxAddress.line1}
                        <br />
                        {user.taxAddress.line2}
                        <br />
                        {user.taxAddress.city}, {user.taxAddress.state}, {user.taxAddress.postcode}, {user.taxAddress.country && user.taxAddress.country.name}
                    </React.Fragment>) 
                    || 
                    (user.homeAddress && <React.Fragment>
                                {user.homeAddress.line1}
                                <br />
                                {user.homeAddress.line2}
                                <br />
                                {user.homeAddress.city}, {user.homeAddress.state}, {user.homeAddress.postcode}, {user.homeAddress.country && user.homeAddress.country.name}
                    </React.Fragment>)}
                </div>
                <div>
                    Email Address: {user.email}
                </div>
                <Row>
                    <Col>
                        <PayPalReceiptLine className="invoice-breakdown-header" description={<span>Description</span>}
                            bitcarPrice={<span>Unit Price (USD)</span>}
                            qty={<span>Qty</span>}
                            totalBitCar={<span>Total USD</span>}
                        />
                        <PayPalReceiptLine isAlternateRow={true}
                            description={<CarFractionToolTip>Fractions of {asset.data.make} {asset.data.model} {infoIcon}</CarFractionToolTip> }
                            bitcarPrice={pricePerToken}
                            qty={tokenQty}
                            totalBitCar={tokenPriceUsd}
                        />
                        <PayPalReceiptLine description={<CarTokenToolTip>Car Tokens ({asset.tokenCode}) {infoIcon}</CarTokenToolTip>}
                            bitcarPrice="0"
                            qty={tokenQty}
                            totalBitCar="0"
                        />
                        <PayPalReceiptLine isAlternateRow={true} description={<EscrowToolTip loadedAsset={asset}>BitCar Escrow {infoIcon}</EscrowToolTip>}
                            bitcarPrice={usdBEEPerToken}
                            qty={tokenQty}
                            totalBitCar={escrowUsd}
                        />
                    </Col>
                </Row>

                <PayPalReceiptLine 
                    className="invoice-breakdown-total"
                    description="TOTAL"
                    bitcarPrice=""
                    qty=""
                    totalBitCar={<h3>{totalPrice}</h3>}
                />
                <div className='footer no-screen'>
                    Date of Printing: {new Date().toString()}
                </div>
            </div>
        </React.Fragment>
        );
    }
}

export default CreditCardReceipt;