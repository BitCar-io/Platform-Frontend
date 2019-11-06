import React from 'react';
import { Checkbox } from 'antd';
import { BUY_BUTTON_TEXT } from '../../util/globalVariables';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { TermsAndConditionsLink, ReturnsPolicyLink } from '../CommonLinks';

interface IAgreeToPurchaseTerms {
    termsChecked:boolean;
    onCheckedChange: ((e: CheckboxChangeEvent) => void);
    isDisabled:boolean;
    buttonTextOverride?:string;
}

const AgreeToPurchaseTerms = (props:IAgreeToPurchaseTerms) => {
    return <div className="align-center">
        <Checkbox className="buy-agree-terms" checked={props.termsChecked} onChange={props.onCheckedChange} disabled={props.isDisabled}>
            <span className={!props.isDisabled && props.termsChecked ? 'text-brighter' : 'text-disabled'}>
                I have read and agree to the <TermsAndConditionsLink /> and <ReturnsPolicyLink />
                <br />
                I agree that by clicking '{props.buttonTextOverride ? props.buttonTextOverride : BUY_BUTTON_TEXT}'
                <br/> I am intending to place an order with an obligation to pay
            </span>
        </Checkbox>
    </div>
}

export default AgreeToPurchaseTerms;