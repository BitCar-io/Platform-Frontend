import React from 'react';
import { Icon } from "antd";
import { ESCROW_TEXT } from '../../util/globalVariables';
import { CarFractionToolTip, CarTokenToolTip, StorageFeeToolTip, EscrowToolTip } from '../asset-actions/buy-tokens/PaymentBreakdown';
import LoadedAsset from '../../classes/LoadedAsset';

interface IFiatPaymentBreakdownProps {
    displayBEE:string;
    displayBEEinUSD:string;
    displayTokenBitCarCost:string;
    displayTokenQty:string;
    displayTotalEthereum:string;
    loadedAsset:LoadedAsset;
}

const FiatPaymentBreakdown = (props:IFiatPaymentBreakdownProps) => {

    const cryptoTotal = false && ` (${props.displayTokenBitCarCost} BITCAR ${props.loadedAsset.requiresEth && <span> + {props.displayTotalEthereum} ETH</span>})`;

    const cryptoEscrow = false && ` (${props.displayBEE} BITCAR)`;

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
                    USD ${props.displayTokenQty}{cryptoTotal}
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
                        USD $0 (no cost)
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
                        USD $0 (waived)
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
                            USD ${props.displayBEEinUSD}{cryptoEscrow}
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
    </React.Fragment>
}
export default FiatPaymentBreakdown;