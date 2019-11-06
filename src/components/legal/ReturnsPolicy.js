import React from 'react';
import { Link } from "react-router-dom";
import { BitCarDefinition, CarDefinition, CarTokenDefinition, DigitalAssetsDefinition, PlatformDefinition } from './TermsAndConditions';
import TermsAndConditionEntry from './TermsAndConditionEntry';
import { URL_TERMS_AND_CONDITIONS } from '../../util/platformNavigation';

const ReturnsPolicy = () => {
    return <div className="returns-text">
        <h1>BitCar Returns Policy</h1>

        <h3>1. DEFINITIONS</h3>
        <div className="term-definition-container">
            <p>As used in this Policy:</p>
            <BitCarDefinition />
            <CarDefinition />
            <CarTokenDefinition sectionRefOverride={<React.Fragment>Section 3 of the <Link to={URL_TERMS_AND_CONDITIONS} target="_blank">Terms and Conditions</Link></React.Fragment>} />
            <DigitalAssetsDefinition />
            <PlatformDefinition />
        </div>

        <div className="returns-container">
            {/* <p>
                Purchasing a fraction of any Car on the platform, requires you to utilise Digital Assets.
            </p> */}
            <TermsAndConditionEntry entryPoint="2" entryTitle="RETURNS"
                subPoints={[{key:"", topText:"Purchasing a fraction of any Car on the platform, requires you to utilise Digital Assets, therefore you understand and accept that;",
                subPoints: [{key:"2.1", text:"	the total amount transferred in Digital Assets to take ownership of a CAR Token, is evaluated based upon the current USD (US Dollar) exchange rate at the time of purchase;"},
                    {key:"2.2", text:"	BitCar cannot control the fluctuating nature of financial markets, which affects the quantity of Digital Assets required to complete a transaction on the platform;"},
                    {key:"2.3", text:"	upon making a decision to purchase CAR Tokens from the platform, you hereby agree to an unwavering exception to the right of withdrawal from the purchase, due to this uncontrollable fluctuation in price which may occur during a standard withdrawal period;"}
                    ],
                bottomText: "Upon committing to the purchase of any CAR Token, you hereby agree that the transaction is non-refundable by BitCar and we cannot accept any submissions or requests for such."}
            ]}
            />
            
            {/* <p>
                You understand and accept, that the total amount transferred in Digital Assets to take ownership of a CAR Token, is evaluated based upon the current USD (US Dollar) exchange rate at the time of purchase.
            </p>
            <p>
                You understand and accept that BitCar cannot control the fluctuating nature of financial markets, which affects the quantity of Digital Assets required to complete the transaction
            </p>
            <p>
                In making a decision to purchase CAR Tokens from the platform, you hereby agree to an unwavering exception to the right of withdrawal from the purchase, due to this uncontrollable fluctuation in price which may occur during a standard withdrawal period
            </p>
            <p>
                Upon committing to the purchase of any CAR Token, you hereby agree that the transaction is non-refundable by BitCar and we cannot accept any submissions or requests for such.
            </p> */}
        </div>
    </div>
}

export default ReturnsPolicy;