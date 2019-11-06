import React from 'react';
import { secondsToYearsString } from '../../../util/helpers';
import { Icon, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { ESCROW_TEXT } from '../../../util/globalVariables';
import { URL_FAQ_ESCROW } from '../../../util/platformNavigation';

export const CarFractionToolTip = props => <Tooltip title={'This is your payment for fractional legal ownership of the vehicle.'}>{props.children}</Tooltip>

export const CarTokenToolTip = props => <Tooltip title={`These are the tokens you will receive for record keeping purposes only.`}>{props.children}</Tooltip>

export const StorageFeeToolTip = props => <Tooltip title={`The cost for secure storage of the vehicle.`}>{props.children}</Tooltip>

export const EscrowToolTip = props => <Tooltip title={`${props.loadedAsset.escrowRateDisplay}% Escrow, refundable to fractional car owners in the event the term is not extended beyond ${secondsToYearsString(props.loadedAsset.tradingPeriodDuration)}, or the remainder after any costs relating to the extension period.`}>{props.children}</Tooltip>

const PaymentBreakdown = props => {
    return <React.Fragment>
        <h2 className="align-left">Payment breakdown:</h2>
        <ul style={{listStyle: 'none', paddingLeft: 0}}>
            {/* tooltips over all of these / display to first 2 decimals / round ETH to Metamask rounding / BITCAR to first 2? decimals */}
                
                <li className="clear-pull">
                    <CarFractionToolTip>
                        <div className="pull-left">
                            Payment for Fractions of the Car: <Icon type="question-circle" />
                        </div>
                    </CarFractionToolTip>
                    <CarFractionToolTip>
                    <div className="pull-right">
                        {props.displayTokenBitCarCost} BITCAR {props.loadedAsset.requiresEth && <span> + {props.displayTotalEthereum} ETH </span>} (USD ${props.displayTokenQty})
                    </div>
                    </CarFractionToolTip>
                </li>
                <li className="clear-pull">
                    <CarTokenToolTip>
                        <div className="pull-left">
                            Car Tokens: <Icon type="question-circle" />
                        </div>
                    </CarTokenToolTip>
                    <CarTokenToolTip>
                        <div className="pull-right">
                            0 BITCAR (no cost)
                        </div>
                    </CarTokenToolTip>
                </li>
                <li className="clear-pull">
                    <StorageFeeToolTip>
                        <div className="pull-left">
                            Storage Fee: <Icon type="question-circle" />
                        </div>
                    </StorageFeeToolTip>
                    <StorageFeeToolTip>
                        <div className="pull-right">
                            0 BITCAR (waived)
                        </div>
                    </StorageFeeToolTip>
                </li>
            {/* <Tooltip title={`A ${props.loadedAsset.pafRateDisplay}% fee for the right to access the platform.`}>
                <li className="clear-pull">
                    <div className="pull-left">Platform Access Fee: <Icon type="question-circle" /></div> <div className="pull-right">{props.displayPAF} BITCAR (USD ${props.displayPAFinUSD})</div>
                </li>
            </Tooltip> */}
                <li className="clear-pull">
                    <EscrowToolTip loadedAsset={props.loadedAsset}>
                        <div className="pull-left">
                            {ESCROW_TEXT}: <Icon type="question-circle" />
                        </div>
                    </EscrowToolTip>
                    <EscrowToolTip loadedAsset={props.loadedAsset}>
                        <div className="pull-right">
                            {props.displayBEE} BITCAR (USD ${props.displayBEEinUSD})
                        </div>
                    </EscrowToolTip>
                </li>
            {/* <div className="clear-pull">
                <Link to={URL_FAQ_ESCROW} target="_blank">Learn more about escrow</Link>
            </div> */}
            {/* <Tooltip title={`A 1.3% transaction fee. Waived in the first 2 years of platform release.`}>
                <li className="clear-pull">
                    <div className="pull-left">Platform Transaction Fee: <Icon type="question-circle" /></div> <div className="pull-right">{props.displayPTF} BITCAR (USD ${props.displayPTFinUSD})</div>
                </li>
            </Tooltip> */}
            </ul>
        {/* <div style={{clear: 'both'}}>Note: Prices may change as they are based on realtime exchange rates.</div> */}
        <br />
        <h3 className="align-center">There are no fees for using the BitCar platform</h3>
        <div className="delivery-details">All tokens will be delivered to your registered trading address {props.hotWallet ? props.hotWallet : ''}</div>
    </React.Fragment>
}
export default PaymentBreakdown;