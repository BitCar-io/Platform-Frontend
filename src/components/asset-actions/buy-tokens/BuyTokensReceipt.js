import React from "react";
import { Alert, Icon, Col, Row } from "antd";
import PropTypes from 'prop-types';
import { convertFromSolidityAndFormatForDisplay, bitcarToUSD, convertFromSolidityNumber } from '../../../util/helpers';
import { connect } from 'react-redux';
import { DISPLAY_DECIMALS_ETH, DISPLAY_DECIMALS_USD, DISPLAY_DECIMALS_BITCAR, DISPLAY_DECIMALS_QUANTITY_SOLD, LEGAL_ENTITY } from "../../../util/globalVariables";
import LinkToEtherScan from "../../LinkToEtherScan";
import ReceiptLine from "./ReceiptLine";
import Moment from 'react-moment';
import { CarFractionToolTip, CarTokenToolTip, EscrowToolTip } from "./PaymentBreakdown";

const BuyTokensReceipt = props => {

    const receipt = props.purchaseReceipt;
    const displayTokenQty = convertFromSolidityAndFormatForDisplay(receipt.tokenAmount, DISPLAY_DECIMALS_QUANTITY_SOLD);
    
    const displayBitCarCostPerToken = receipt.tokenCostBitcar.dividedBy(receipt.tokenAmount).toFormat(DISPLAY_DECIMALS_BITCAR);
    const displayBitCarCost = convertFromSolidityAndFormatForDisplay(receipt.tokenCostBitcar, DISPLAY_DECIMALS_BITCAR);

    const displayEthereumCostPerToken = receipt.ethCost.dividedBy(convertFromSolidityNumber(receipt.tokenAmount)).toFormat(DISPLAY_DECIMALS_ETH);
    const displayEthereumCost = receipt.ethCost.toFormat(DISPLAY_DECIMALS_ETH);

    const displayBEEPerToken = receipt.beeCost.dividedBy(receipt.tokenAmount).toFormat(DISPLAY_DECIMALS_BITCAR);
    const displayBEE = convertFromSolidityAndFormatForDisplay(receipt.beeCost, DISPLAY_DECIMALS_BITCAR);
    // const displayPAF = convertFromSolidityAndFormatForDisplay(receipt.pafCost, DISPLAY_DECIMALS_BITCAR);
    // const displayPAFinUSD = props.bitcarUsd && convertFromSolidityAndFormatForDisplay(bitcarToUSD(receipt.pafCost, props.bitcarUsd), DISPLAY_DECIMALS_USD);
    // const displayPTF = convertFromSolidityAndFormatForDisplay(receipt.ptfCost, DISPLAY_DECIMALS_BITCAR);
    // const displayPTFinUSD = props.bitcarUsd && convertFromSolidityAndFormatForDisplay(bitcarToUSD(receipt.ptfCost, props.bitcarUsd), DISPLAY_DECIMALS_USD);

    const displayTotalBitcarSpent = convertFromSolidityAndFormatForDisplay(receipt.totalBitcarSpent, DISPLAY_DECIMALS_BITCAR);

    const infoIcon = <Icon className="no-print" type="question-circle" />

    return <React.Fragment>
        <Alert className="no-print" type="success" message={`Successfully purchased ${displayTokenQty} fractions of the car - your invoice is provided below, please print for your records.`} />
        <br className="no-print" />

        <div className="token-invoice">

            <h1>PURCHASE INVOICE</h1>
            <div className="print-header no-screen">
                <img src={require("../../../logos/logo_bitcar.png")} className="print-logo" alt="bitcar logo" />
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
                            Date (UTC): <Moment format="DD MMM YYYY">{receipt.transactionTime}</Moment>
                        </div>
                        <div>
                            Payment fully received
                        </div>
                        <div>
                            Blockchain Transaction Hash:
                        </div>
                        <div className="underline">
                            {props.connectedNetwork && <a href={`${props.connectedNetwork.networkDetails.scanUrl}/tx/${receipt.transactionHash}`}>{receipt.transactionHash}</a>}
                        </div>
                    </div>
                </Col>
            </Row>
            
            <Col className="invoice-item-separator"></Col>

            <h2>Bill to</h2>
            <div>
                User Wallet Address: {receipt.user} <LinkToEtherScan address={receipt.user} isToken={false} />
            </div>
            <div>
                Car Tokens Delivered to Address: {receipt.user} <LinkToEtherScan address={receipt.user} isToken={false} />
            </div>
            <Row>
                <Col>
                    <ReceiptLine className="invoice-breakdown-header" description={<span>Description</span>}
                        bitcarPrice={<span>Unit Price (BITCAR)</span>}
                        ethPrice={<span>Unit Price (ETH)</span>}
                        qty={<span>Qty</span>}
                        totalBitCar={<span>Total BITCAR</span>}
                        totalEth={<span>Total ETH</span>}
                    />
                    <ReceiptLine isAlternateRow={true}
                        description={<CarFractionToolTip>Fractions of {receipt.loadedAsset.data.make} {receipt.loadedAsset.data.model} {infoIcon}</CarFractionToolTip> }
                        bitcarPrice={displayBitCarCostPerToken}
                        ethPrice={displayEthereumCostPerToken}
                        qty={displayTokenQty}
                        totalBitCar={displayBitCarCost}
                        totalEth={displayEthereumCost}
                    />
                    <ReceiptLine description={<CarTokenToolTip>Car Tokens ({receipt.loadedAsset.tokenCode}) {infoIcon}</CarTokenToolTip>}
                        bitcarPrice="0"
                        ethPrice="0"
                        qty={displayTokenQty}
                        totalBitCar="0"
                        totalEth="0"
                    />
                    {/* <ReceiptLine isAlternateRow={true}
                        description="Storage Fee"
                        bitcarPrice="0"
                        ethPrice="0"
                        qty={displayTokenQty}
                        totalBitCar="0"
                        totalEth="0"
                    /> */}
                    <ReceiptLine isAlternateRow={true} description={<EscrowToolTip loadedAsset={receipt.loadedAsset}>BitCar Escrow {infoIcon}</EscrowToolTip>}
                        bitcarPrice={displayBEEPerToken}
                        ethPrice="0"
                        qty={displayTokenQty}
                        totalBitCar={displayBEE}
                        totalEth="0"
                    />
                </Col>
            </Row>


            <ReceiptLine 
                className="invoice-breakdown-total"
                showInfoIcon={false}
                description="TOTAL"
                totalBitCar={<h3>{displayTotalBitcarSpent}</h3>}
                totalEth={<h3>{displayEthereumCost}</h3>}
            />

            <div className="foot-note">
                <p>{`Exchange rate at time of transaction was 1 BITCAR = ~USD $${receipt.exRateBitCarUSD.toFormat(3)}`}</p>
                <p>{`Exchange rate at time of transaction was 1 ETH = ~USD $${receipt.exRateEthUSD.toFormat(3)}`}</p>
                <p>{`Based upon these exchange rates the equivelant total price was ~USD $${receipt.totalUsd.toFormat(DISPLAY_DECIMALS_USD)}`}</p>
                * Please note that this invoice only includes your payment for car fractions. The displayed USD exchange rates are rounded to 3 decimals for readability.
                <br />
                This invoice does not include any Ethereum Network transaction costs or 'gas' fees associated with your payment, which are not governed by the BitCar platform.
            </div>
            <div className='footer no-screen'>
                Date of Printing: {new Date().toString()}
            </div>
        </div>
    </React.Fragment>
}
BuyTokensReceipt.propTypes = {
    purchaseReceipt: PropTypes.object.isRequired
};
const mapStateToProps = (state) => {
    return {
      bitcarUsd: state.PlatformEvent.bitcarUsd,
      ethUsd: state.PlatformEvent.ethUsd,
      isTickerOnline: state.PlatformEvent.isTickerOnline,
      connectedNetwork: state.UIstate.connectedNetwork
    }
}
export default connect(mapStateToProps)(BuyTokensReceipt);