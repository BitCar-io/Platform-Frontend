import React from 'react';
import { TermsAndConditionsLink, HighlightedPlatformLink } from '../CommonLinks';
import { URL_PRIVACY_POLICY } from '../../util/platformNavigation';

interface IFiatInformation {
}

const FiatInformation = (props:IFiatInformation) => {
    return <React.Fragment>
        <h1>Why do we need some personal data?</h1>
        <p>
            Due to BitCar operating in a highly regulated industry, we need to gather certain information as outlined in our <TermsAndConditionsLink />, <HighlightedPlatformLink to={URL_PRIVACY_POLICY} title="Opens Privacy Policy in new window" text="Privacy Policy" /> and <HighlightedPlatformLink to={URL_PRIVACY_POLICY} title="Opens AML Policy in new window" text="Anti-Money-Laundering (AML) Policy" />.
        </p>
        <p>
            This information is used to ensure that we adhere to AML policies and procedures enforced by regulatory bodies. Ensuring that the BitCar platform is used correctly, whilst being kept fair and safe for all of our users is of utmost importance to us.
        </p>
        <p>
            Although PayPal offers us huge flexibility to our customers, allowing you to purchase the car using non-cryptocurrency options, it does create additional avenues for abuse of these policies. Through our Know Your Customer (KYC) process (over the next two steps), we gather information prior to your payment to ensure we can enforce these policies correctly.
        </p>
        <p>
            The final 'Payment' step will allow you to review your purchase and adjust it if necessary.
        </p>
    </React.Fragment>
}

export default FiatInformation;