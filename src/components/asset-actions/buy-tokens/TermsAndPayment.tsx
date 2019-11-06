import React, { ReactFragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Badge, Radio, Col, Row, Checkbox, Button } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import { RadioChangeEvent } from 'antd/lib/radio';
import Fees from '../../../classes/Fees';
import { URL_TERMS_AND_CONDITIONS, URL_RETURNS_POLICY } from '../../../util/platformNavigation';
import { Link } from 'react-router-dom';
import { BUY_BUTTON_TEXT } from '../../../util/globalVariables';
import LoadingIndicator from '../../LoadingIndicator';

interface IState {
    termsChecked:boolean;
    pending:boolean;
}

interface ITermsAndPaymentProps {
    userIsTrader:boolean;
    buyFees: Fees;
    hasWarning: boolean;
    handleBuyButtonClicked: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void);
    validationPending: boolean;
}

class TermsAndPayment extends React.Component<ITermsAndPaymentProps, IState> {

    constructor(props:ITermsAndPaymentProps) {
        super(props);

        this.state = {
            pending: false,
            termsChecked: false
        } as IState;
    }

    onTermsChange = () => {
        this.setState({termsChecked: !this.state.termsChecked});
    }

    render() {
        const props = this.props;
        const state = this.state;
        const feesAreValid = props.buyFees && props.buyFees.tokenQty && props.buyFees.tokenQty.isGreaterThan(0);

        return <div className="align-center">
            {props.userIsTrader && props.buyFees && !props.hasWarning && <React.Fragment>
                <div className="align-center">
                    <Checkbox className="buy-agree-terms" checked={state.termsChecked} onChange={this.onTermsChange} disabled={!feesAreValid || state.pending}>
                        <span className={feesAreValid && state.termsChecked ? 'text-brighter' : 'text-disabled'}>
                            I have read and agree to the <Link to={URL_TERMS_AND_CONDITIONS} target="_blank" className="link-highlight no-wrap" title="Open Terms and Conditions in new window">Terms and Conditions</Link> and <Link to={URL_RETURNS_POLICY} target="_blank" className="link-highlight no-wrap" title="Open Returns Policy in new window">Returns Policy</Link>
                            <br />
                            I agree that by clicking '{BUY_BUTTON_TEXT}'
                            <br/> I am placing my order with an obligation to pay
                        </span>
                    </Checkbox>
                </div>
            
                <Button id="buyTokens" size={'large'} onClick={props.handleBuyButtonClicked} disabled={this.state.pending || !state.termsChecked || !feesAreValid }>
                    {!state.pending && <span>{BUY_BUTTON_TEXT}</span>}
                    {state.pending && <LoadingIndicator text={props.validationPending ? 'Validating' : 'Purchasing'} />}
                </Button>
            </React.Fragment> }
        </div>
    }

}

export default TermsAndPayment;