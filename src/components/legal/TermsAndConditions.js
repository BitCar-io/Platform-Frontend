import React from 'react';
import { Link } from "react-router-dom";
import TermDefinition from './TermDefinition';
import TermsAndConditionEntry from './TermsAndConditionEntry';
import { URL_AML_POLICY, URL_RETURNS_POLICY } from '../../util/platformNavigation';
import { LEGAL_ENTITY, CAR_TITLE_ENTITY, BITCAR_ENTITY } from '../../util/globalVariables';

export const BitCarDefinition = () => <TermDefinition definition="Bitcar" text={<React.Fragment>, <span className="terms-highlight">“we”</span> and <span className="terms-highlight">“us”</span> means <span className="terms-highlight">{LEGAL_ENTITY.entityName}</span>, a company incorporated in {LEGAL_ENTITY.country}, and any affiliates thereof. </React.Fragment>} />

export const CarDefinition = () => <TermDefinition definition="Car" text=" means an exotic motor vehicle sold on the Platform by an Agent; " />

export const CarTokenDefinition = (props) => <TermDefinition definition="CAR Token" text={<React.Fragment> means a cryptographic token representing and operating as the digital receipt for a fractional ownership interest in a Car; For ease of reference herein, actions involving CAR tokens means actions involving the fractional interest in the Car they represent. However, CAR tokens are only the digital receipt and have a zero cost base themselves (for more information see {props.sectionRefOverride ? props.sectionRefOverride : "Section 3"}). </React.Fragment>} /> 

export const DigitalAssetsDefinition = () => <TermDefinition definition="Digital Assets" text=" mean CAR Tokens, Bitcar cryptocurrency, Ethereum and any other cryptocurrency accepted by or able to be traded on the Platform; " /> 

export const PlatformDefinition = () => <TermDefinition definition="Platform" text=" means the platform licensed to and operated by Bitcar via the Website for the trading of CAR Tokens; " />

const TermsAndConditions = () => {
    return <div className="terms-text">
    <h2 className="align-center">Terms of Use</h2>
    <p className="last-updated align-center">
      These Terms of Use were published and last updated on April 30, 2019
    </p>
    <p className="terms-initial-warning">
      BY ACCESSING THIS WEBSITE OR REGISTERING AS A USER ON THE PLATFORM OPERATED THROUGH THE WEBSITE OR USING ANY OTHER SERVICES MADE AVAILABLE THROUGH THE WEBSITE (COLLECTIVELY, THE “SERVICES”), YOU ARE AGREEING TO ACCEPT AND COMPLY WITH THE TERMS OF USE STATED BELOW.  IF YOU DO NOT ACCEPT THESE TERMS OF USE, DO NOT ACCESS THE WEBSITE AND DO NOT USE THE SERVICES.
    </p>
    <p className="terms-initial-warning">
      YOU SHOULD READ THE ENTIRE TERMS OF USE BEFORE USING THE WEBSITE OR ANY OF THE SERVICES.
    </p>

    <h3><span className="terms-number">1.</span>DEFINITIONS</h3>

    <div className="term-definition-container">
        <p>As used in these Terms of Use:</p>

      <TermDefinition definition="Agent" text={` means an agent who sells a Car through the Platform including ${CAR_TITLE_ENTITY.entityName}, a Company incorporated in ${CAR_TITLE_ENTITY.country}. `} /> 
      <BitCarDefinition />
      <CarDefinition />
      <CarTokenDefinition />
      <DigitalAssetsDefinition />
      <PlatformDefinition />
      <TermDefinition definition="Restricted Country" text=" has the meaning given in section 4.7; " />
      <TermDefinition definition="Services" text=" mean the services made available by Bitcar through the Website and the Platform; " />
      <TermDefinition definition="Terms of Use" text=" mean these terms and conditions of use, as amended by Bitcar from time to time; " />
      <TermDefinition definition="User" text=" means a registered user of the Platform; " /> 
      <TermDefinition definition="Wallet" text=" means any Ethereum public key address provided to Bitcar by a User; and " />
      <TermDefinition definition="Website" text={<React.Fragment> means the Platform software hosted on the Ethereum Blockchain including any linked components and any relevant material on <span className="terms-highlight"><a href='https://bitcar.io'>bitcar.io</a></span> including any subdomains thereof. </React.Fragment>} /> 
    </div>
    <TermsAndConditionEntry entryPoint="2" entryTitle="PLATFORM"
        subPoints={[{key:2.1, topText:"The Platform allows registered Users to acquire CAR Tokens (as described in section 4 below) from Agents and to trade those tokens with other registered Users. Each CAR Token is used by the Platform to represent a fractional ownership interest in a Car."},
        {key:2.2, topText:"You will only be able to acquire, dispose of, trade or receive cryptocurrency in respect of CAR Tokens if you are successfully registered as a User by Bitcar."},
        {key:2.3, topText:"The Services available to you through the Platform will depend upon the country from which you access the Platform or in which you reside or whose citizenship you hold. You must meet certain other eligibility criteria to use the Platform."},
      ]}
    />
    <TermsAndConditionEntry entryPoint="3" entryTitle="CARS AND CAR TOKENS"
        subPoints={[{key:3.1, topText:"A CAR Token is a cryptographic token representing a fractional ownership interest in a particular Car which is being traded on the Platform and functions only as a digital receipt of that ownership interest."},
        {key:3.2, topText:"CAR Tokens can be acquired on the Platform through an Agent or from other Users."},        
        {key:3.3, topText:"CAR Tokens can only be transferred to other registered Users whose Wallet addresses have been registered and “whitelisted” on the Platform. Any peer to peer trading of CAR Tokens outside of the Platform user interface will be recognised by Bitcar as if they were performed on the Platform and the new fractional ownership interests in the Car will be updated by the Platform’s software onto the public Ethereum blockchain. "},        
        {key:3.4, topText:"You acknowledge that by acquiring or disposing of a CAR Token you are simultaneously acquiring or disposing of a fractional interest in a Car. You agree that although the fractional ownership interest in the Car is distinct and separate from the CAR Token, the Platform treats the CAR Token as representing your fractional ownership interest in the Car, and that the two cannot be separated for the purposes of the proper operation of the Platform."},        
        {key:3.5, topText:"You agree that you will indemnify and not make a claim against a User (or Bitcar, its affiliates and its Agents) - that has received CAR Tokens from you or your ETH Address - that the fractional ownership interests represented by the transferred CAR Tokens have NOT been transferred to the User along with the CAR Tokens; you further agree any breach of this term will (i) result in the immediate permanent cancellation of your registration (ii) that Bitcar and or its Agents will assume you have or actually transfer the relevant fractional ownership interests to the CAR Tokens holder to whom you transferred the Car tokens and that your CAR token holdings maybe forfeited permanently by Bitcar. "},        
        {key:3.6, topText:"You agree that your fractional ownership interest in a Car will be permanently lost if your corresponding CAR Token are lost, hacked or stolen and Bitcar and its affiliates will not be liable for any losses you may suffer as a result."},        
        {key:3.7, topText:"You agree that Bitcar or an Agent will make arrangements for the storage, transportation, insurance and time to time display of and maintenance of the Cars on the Platform and may vary these arrangements from time to time, even after a Car has been sold on the Platform. Bitcar will not be liable for any acts or omissions and you agree you will not make a claim against Bitcar or Agents in respect of these services."},        
        {key:3.8, topText:"In the event no valid applicable insurance is recognized or an insurer refuses to pay out on a claim for any damages to a Car such as from Fire, Theft prior to it being finally sold (including any damage whilst it is displayed or on route to or from a display), then such Agent may seek a restitution payment in Bitcar tokens from Bitcar (and or its affiliates or a third party) to apply towards the damages on behalf of the fractional owners. A pool of 30 million Bitcar tokens is initially available and held at 0x531c5c5d8fe711cad4ad8d4cc1d07f98e3a19703 for bona fide claims approved by Bitcar on a reasonable basis towards such cases and you agree that Bitcar may reduce this amount over time with growth of the Platform."},
        {key:3.9, topText:"While the Agents will perform due diligence on all the Cars which are made available on the Platform (and will make the results of those enquiries available on the Platform) it is possible that a defect, incorrect or unknown fact or bad provenance may not be discovered by an Agent, which may affect the value the Car. In these circumstances you acknowledge and agree that Bitcar and the Agents will not be liable for any losses you may incur as a result."},
        {key:3.10, topText:"The value of a Car on the Platform may go up or down prior to the ultimate sale of the Car and Bitcar cannot predict and makes no claims whatsoever in respect of the future value of any Car.  "},
        {key:3.11, topText:"A Car may sell for less than the amount it was originally bought for on the Platform (or be lost or written off) for reasons including, but not limited to:",
          subPoints: [{key:"(a)", text:"the Car is stolen, damaged or destroyed;"},
          {key:"(b)", text:"	any insurance claim made in respect of the Car is invalid or rejected by the insurer;"},
          {key:"(c)", text:"	any restitution payment made in respect of a loss on a Car "},
          {key:"(d)", text:"	a defect is discovered in relation to a Car;"},
          {key:"(e)", text:"	a claim on the title to the Car has arisen or is disputed;"},
          {key:"(f)", text:"	the previously reported provenance of the car proves to be inaccurate; or"},
          {key:"(g)", text:"	a legal judgment or claim attaches to the Car"}
          ],
          bottomText: "and Bitcar, its affiliates and the Agents will not be liable for any losses you may incur as a result."},
        {key:3.12, topText:"In making a decision to purchase CAR Tokens, whether from an Agent or from other Users, and generally in making decisions as to your investment strategy and suitable CAR Tokens, you acknowledge and agree that you have considered your entire financial situation including other financial commitments, and you understand that investments in CAR Tokens are highly speculative and that you may sustain significant losses up to the whole invested amount. Bitcar is unable to provide any guarantee or assurance as to the performance of any particular Car."},
        {key:3.13, topText:"A CAR Token is the only means of recording and verifying your fractional ownership interest in a Car and the only way to facilitate the redemption of any funds you are entitled to once the Car is sold.  If you lose or are otherwise unable to access your CAR Tokens, you will not be able to access these proceeds of sale and Bitcar and the Agents will not be liable for any losses you may incur as a result."},
        {key:3.14, topText:"Under no circumstances will Bitcar be under any obligation to deliver a Car to CAR Token holders prior to the sale of the Car. The Car will remain in the exclusive possession and control of Bitcar and or its Agents (as the bailee of the CAR Token holders) until the Car is sold at the end of its agreed term and may be put on public display during the interim period.  Your acquisition of the fractional interest in a Car/ the CAR Tokens takes place on the express and irrevocable condition that you waive any rights you may have (either individually or collectively) to seek possession or control of the Car. "},
        {key:3.15, topText:"Bitcar has the right to ask holders of CAR Tokens to exchange them for replacement tokens, but this will typically only occur in the unlikely event of a major hack or Platform failure. This right will not be triggered due to any party losing control of their CAR Tokens no matter how this occurs including if private address keys are compromised, hacked, lost or stolen. "},
        {key:3.16, topText:"When a Car is sold on the behalf of fractional owners of the Car, any fees and commissions due must be paid and these will be deducted from the sale price. Thereafter, any profit made on the sale of the Car may be taxed depending on the taxation laws in force at that time. No less than 88 % of any after tax profit will be paid to CAR Token holders, with up to 12 % going to the Agent, the exact percentages will be displayed with the information about the Car at its launch. If a loss is made on the sale of the Car once fees and commissions have been paid, no payments will be made to the Agent or Bitcar as Platform operator."},
        {key:3.17, topText:"Redemptions of CAR Tokens once a Car is sold may be carried out by a third party other than the original Agent. All payments to CAR Token holders will be made in Ethereum (or in the event of a concern about Ethereum on the part of the Agent or Bitcar, another cryptocurrency in force at that time which will be selected by the Agent or Bitcar in its absolute discretion) and will be deposited direct to the User’s Wallet.  "},
        {key:3.18, topText:"Notification that a Car has been sold will be displayed on the Platform. You agree to redeem any proceeds you receive from the sale of a Car within 365 days of the car being sold, after which time the proceeds of all unredeemed Car tokens will be forfeited and applied by Bitcar towards costs."},
        {key:3.19, topText:"You agree that if one User holds more than 90% of the CAR Tokens on issue in relation to a Car, the remaining 10% of CAR Token holders will be required to sell their tokens to the 90% holder for the pro rata equivalent of the original listed price for the Car plus 35%. In this event, all trading in the relevant CAR Tokens will be suspended and the Platform will display the Car as having been sold."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="4" entryTitle="REGISTRATION"
        subPoints={[{key:4.1, topText:<React.Fragment>You will not be able to access or use the Services until you have been registered as a User by Bitcar and allocated a membership level, passing all requested identity and security validation and verification checks, and provided information and documents requested in accordance with the Bitcar policy on Know-Your-Customer and Anti-Money laundering regulations (<Link to={URL_AML_POLICY} title="Open BitCar AML Policy in new window" target='_blank'>See Bitcar Anti Money Laundering and Sanctions Policy</Link>). Bitcar (or a third-party) provider may check all personal and identity verification information you provide with credit reference or fraud prevention agencies and other organizations. These agencies may keep a record of your information and the searches made. However, we do not perform a credit check and any search is for identity purposes only and will be recorded as such. We will keep records of the information and documents we obtain to verify your identity in accordance with all applicable legal and regulatory requirements.</React.Fragment>},
        {key:4.2, topText:"For the purposes of complying with its policy on anti-money laundering prevention and combating terrorist activities, Bitcar reserves the right to request any additional information and documents from you about you and/or your transactions on the Platform regardless of your membership level, and suspend your registration anytime in case the documents or information provided by you are unsatisfactory or insufficient, as Bitcar may decide in accordance with its internal policies."},
        {key:4.3, topText:"Bitcar may from time to time be required by law and any applicable regulation (including without limitation local, national and international acts and regulations) and/or such policies and procedures as we may from time to time adopt to implement or comply with our obligations under the same to confirm and verify the identity of each person who registers on the Platform."},
        {key:4.4, topText:"By registering as a User of the Platform, you agree to provide Bitcar with the requested information applicable to the membership level and to keep such information up to date."},
        {key:4.5, topText:"Bitcar has three levels of registration:",
          subPoints: [{key:"(a)", text:"	Bronze - total acquisitions up to a maximum of EUR 15,000 with single transaction limits;"},
          {key:"(b)", text:"	Silver - total acquisitions up to a maximum of EUR 50,000 with single transaction limits; and"},
          {key:"(c)", text:"	Gold - no asset or transaction limits."}],
          bottomText: <React.Fragment><p><span className="terms-highlight">Different identity and security validation and verification apply to each level.</span></p>
          <p>
            Bitcar will not register Users (including residents and citizens, or through agency or representation) in certain jurisdictions which may change without notice from time to time but currently including the <span className="terms-highlight">United States of America</span>, Australia, Afghanistan, Albania, Argentina, Armenia, Azerbaijan, Belarus, Burundi, Burma, Cuba, Democratic Republic of Congo, Eritrea, Iran, Lebanon, Libya, Macao Special Administrative Region, Portugal, Republic of Guinea, Serbia, Singapore, Somalia, South Sudan, Sudan, Syria, Rwanda, Tanzania, Uganda and Zimbabwe (each a “Restricted Countries”) and the Platform will block any transactions which involve a Restricted Country. The smart contracts embedded in the CAR Tokens will also block any off Platform peer to peer transactions involving Users in <span className="terms-highlight">Restricted Countries.</span>
          </p>
          </React.Fragment>
        },
        {key:4.6, topText:"If you are not a resident or citizen of a Restricted Country but are travelling to any of these countries, you acknowledge and agree that:",
          subPoints: [{key:"(a)", text:"	you will not use the Services while in any of the Restricted Countries; and "},
          {key:"(b)", text:"	the Services will be unavailable and/or blocked in the Restricted Countries."}]},
        {key:4.7, topText:<span className="terms-warning uppercase">RESIDENTS OF THE UNITED STATES OF AMERICA AND ITS EXTERNAL TERRITORIES ARE STRICTLY PROHIBITED FROM USING THE PLATFORM AND THE SERVICES DUE TO THE LAWS AND REGULATIONS IN FORCE IN THAT COUNTRY.</span>},
        {key:4.8, topText:"By registering as a User, you expressly represent and warrant that:",
          subPoints: [{key:"(a)", text:"	you agree to be bound by these Terms of Use;"},
          {key:"(b)", text:"	you fully understand the content of these Terms of Use and agree with them being provided in English language;"},
          {key:"(c)", text:"	you are at least 18 years old and have the right to access the Services;"},
          {key:"(d)", text:"	all information you provide to us is accurate and complete and you will promptly notify us of any changes to any information you have provided;"},
          {key:"(e)", text:"	you have not previously been rejected for an account with Bitcar or removed or suspended from using the Platform or the Services;"},
          {key:"(f)", text:"	you are not violating any agreement to which you are a party by accessing the Services;"},
          {key:"(g)", text:`	you understand you have the ability to vote to exert real day to day control over the management of the Cars and you understand and accept that Bitcar falls outside the defined scope of regulated financial services in ${LEGAL_ENTITY.country}.`},
          {key:"(h)", text:"	by accessing the Services you are not violating the rights of any third party or any laws which are applicable to you;"},
          {key:"(i)", text:"	understand the taxes applicable in your jurisdiction;"},
          {key:"(j)", text:"	you are not a resident or citizen of a Restricted Country; and"},
          {key:"(k)", text:"	any cryptocurrency or other digital assets deposited by you to your Wallets belong to you and are of legitimate origin."}],
        },
        {key:4.9, topText:<span className="terms-warning">By registering as a User, you expressly agree that you will not use the Services to engage in criminal activity of any kind, including but not limited to, money laundering, illegal gambling operations, terrorist financing or malicious hacking.</span>}
      ]}
    />
    <TermsAndConditionEntry entryPoint="5" entryTitle="WALLETS"
        subPoints={[{key:5.1, topText:"To register as a User you must provide two Ethereum public key addresses (each a “Wallet”) to Bitcar which will be linked to your registration.  One Wallet must be a transaction wallet used to send and receive CAR Tokens and payments for CAR Tokens, while the other Wallet must be used to store your CAR Tokens and other Digital Assets in a more secure manner. It is your sole responsibility to keep the private keys for your Wallets secure at all times and you indemnify Bitcar from any losses that may result from your failure to do so."},
        {key:5.2, topText:"You should consider storing your fractional car ownership interest tokens in your storage wallet. "},
        {key:5.3, topText:"You must not share the private keys for your Wallets or allow any other party to use them on your behalf. You acknowledge that neither the Agent nor Bitcar will assist in the event your trading or storage address wallets have been compromised and you indemnify both the Agents and Bitcar against any losses in respect of such compromised addresses."},
        {key:5.4, topText:<span className="terms-warning">There is nothing Bitcar can do if CAR Tokens or other Digital Assets are hacked or stolen from your Wallets (your fractional car interests will be permanently lost) and Bitcar will not be liable for any losses you may suffer as a result.</span>},
        {key:5.5, topText:"The Platform is for personal and non-commercial use only except as explicitly agreed with any Gold members from time to time. By registering as a User with Bitcar, you agree that you will not use your Wallets other than for your own legitimate purpose or access the Wallets of any other User at any time or assist others in obtaining unauthorised access."},
        {key:5.6, topText:"The creation or use of any Wallets without obtaining the prior express permission of Bitcar will result in the immediate suspension of the Wallets, as well as all pending transactions posted to the Wallets. Any attempt to do so or to assist others (whether Users or otherwise), or the distribution of instructions, software or tools for that purpose, will result in the Wallets of such Users being terminated."},
        {key:5.7, topText:"You are responsible for maintaining the confidentiality of your Wallet information, including your password, private identification keys, and all activity including transactions that are posted to your Wallet. Any actions on the Website, transactions, and operations initiated from your Wallets or using your password:",
          subPoints: [{key:"(a)", text:"	will be considered to have been made by you; and "},
          {key:"(b)", text:"	are irrevocable once validated using your password or made through your Wallet. "}]
        },
        {key:5.8, topText:"If there is any suspicious activity related to your Wallets, Bitcar may, but is not obliged to, request additional information from you, including authenticating documents, and to freeze any transactions or fractional interest in Cars, pending Bitcar’s review and you are obliged to comply with these security requests and, if requested, to pay Bitcar’s reasonable costs of doing so."},
        {key:5.9, topText:"Access to the Platform may be permanently suspended or restricted for any User who violates these rules, or has not complied with any requests made by Bitcar and thereafter such User may be held liable for any losses incurred by Bitcar, the Agents or any other User as a result."},
      ]}
    />
    <TermsAndConditionEntry entryPoint="6" entryTitle="DEPOSITS AND WITHDRAWALS"
        subPoints={[{key:6.1, topText:"To acquire CAR Tokens on the Platform you will need to transfer Ethereum (or any other cryptocurrency accepted by the Platform) to your Wallet addresses. You may be charged fees by the third parties that you use to credit your Wallet and Bitcar is not responsible for any fees or for the management and security on the part of any third party involved in funds transfer. You agree to comply with all terms and conditions imposed by the third party executing the transfer. The timing to complete funds transfer transactions will depend in part upon the performance of third parties and Bitcar makes no guarantee regarding the amount of time it may take to credit funds to your Wallet."},
        {key:6.2, topText:"Proceeds from the sale of CAR Token will be credited to your Wallet, less any transactional or other fees. Bitcar does not pay interest on any balances held in your Wallet."},
        {key:6.3, topText:"When you request that we credit Digital Assets to your Wallet or request that we withdraw Digital Assets to your external account from your Wallet, you authorise Bitcar to execute such transactions. In some cases, a payment institution may reject your transfer or it may otherwise be unavailable. You agree that you will not hold Bitcar liable for loss or damages resulting from such rejection or transfer failure, provided that there is no wilful misconduct or fraud of Bitcar."},
        {key:6.4, topText:"The User is fully responsible for possible indication of an incorrect address for a withdrawal, and as a consequence, possible financial losses."},
      ]}
    />
    <TermsAndConditionEntry entryPoint="7" entryTitle="ORDERS"
        subPoints={[{key:7.1, topText:"The Platform connects verified Users so that they can trade CAR Tokens via the Platform. Your Wallet allows you to place an instruction to buy or sell a specified quantity of CAR Tokens at a specified price. You must have a sufficient balance of cryptocurrency in your Wallet to cover the total value of the order. Orders and trading are subject to limits, which are displayed in your Wallet."},
        {key:7.2, topText:"You warrant and represent that you will use reasonable endeavours to ensure that any order placed by you with us is consistent with laws and regulations applicable to you in your jurisdiction."},
        {key:7.3, topText:"Bitcar is under no obligation to execute any order, thus it can decline the execution of any orders and/or cancel a transaction, for a variety of reasons, including, but not limited to, the size of an order, market conditions, a violation of any applicable laws and regulations related to your orders, insufficient funds in your Wallet and risks considerations."},
        {key:7.4, topText:"You are responsible for monitoring all of your orders placed with the Platform yourself. Unless agreed otherwise, all amounts payable by you are due immediately and must be paid on entering into the transaction."},
        {key:7.5, topText:"When entering into an order for car fractions, you irrevocably and unconditionally agree to accept the prices quoted on the Platform, including the price of the Bitcar cryptocurrency which may be manually set from time to time at the sole discretion of Bitcar on which the respective transactions will be executed. Such prices may not necessarily reflect the true value of the underlying asset or cryptocurrency and Bitcar disclaims any liability with respect to any such discrepancies."},
        {key:7.6, topText:"You acknowledge that it may be not possible to cancel or modify an order. Bitcar will not be liable to you if we are unable to cancel or modify an order. You agree that, if an order cannot be cancelled or modified by your request, you are bound by any subsequent execution of the order. You are responsible for monitoring the status of your pending orders and requests."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="8" entryTitle="ACCOUNT USAGE REQUIREMENTS"
        subPoints={[{key:8.1, topText:"To protect Users and ensure equal trading conditions Bitcar reserves the right to suspend or terminate your registration (including your username and password) in the case of the following signs of suspicious trading activity:",
          subPoints: [{key:"(a)", text:"	spamming of the order book – sending and cancelling of small orders without trading intention;"},
          {key:"(b)", text:"	order book manipulation – low ratio of filled to placed orders; or"},
          {key:"(c)", text:"	overloading of exchange infrastructure – continuous high frequency placing of orders which prevent other users from trading."}],
        },
        {key:8.2, topText:"By accessing the Services, you agree to abide by the above covenants and accept that Bitcar may take actions to apply relevant rules without receiving your consent or giving prior notice to you. You agree to indemnify, protect, defend and hold Bitcar and Agents free and harmless from all costs, liabilities and expenses, arising directly or indirectly as a result of your violation."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="9" entryTitle="TERMINATION AND SUSPENSION OF REGISTRATION"
        subPoints={[{key:9.1, topText:"Your registration as a User of the Platform does not expire and will remain valid until terminated by Bitcar or by you."},
        {key:9.2, topText:"Bitcar may terminate your registration (including your username and password) at any time, and without reason, and may send you a 14-day notice via email."},
        {key:9.3, topText:"Bitcar may terminate your registration immediately and without prior notice (including permanently removing your Wallets addresses from Bitcar’s whitelist meaning you will no longer be able to trade CAR Tokens or receive cryptocurrency on the ultimate sale of the Car) in the following cases:",
          subPoints: [{key:"(a)", text:"if for any reason we decide to discontinue to provide the Services (either in whole or in part);"},
          {key:"(b)", text:"	if you fail to pay applicable fees or make any other payments when due;"},
          {key:"(c)", text:"	if you have breached any of the terms of these Terms of Use;"},
          {key:"(d)", text:"	in case of any circumstance having a material adverse effect on your financial position, assets or liabilities;"},
          {key:"(e)", text:"	if any representation or warranty made by you proves to have been materially incorrect or inaccurate when made;"},
          {key:"(f)", text:"	if we suspect your account is being used in an unauthorised manner, including without limitation, to commit fraud or for other illegal purposes; "},
          {key:"(g)", text:"	if we need to do so to comply with an applicable law or with a request of law enforcement or other government agencies or a court."},
          {key:"(h)", text:"	upon the issuance of any application, order, resolution or other announcement in relation to bankruptcy or winding-up proceedings in respect of you; or"},
          {key:"(i)", text:"	in the event of your death."}]
        },
        {key:9.4, topText:"If your registration is terminated for any reason due to suspected misconduct on your part, Bitcar reserves the right to withhold any funds or assets in your Wallets until the matter has been resolved."},
        {key:9.5, topText:"Termination of your registration will not extinguish or alter any rights, obligations or liabilities that accrued prior to the termination."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="10" entryTitle="AVAILABILITY OF SERVICES"
        subPoints={[{key:10.1, topText:"Bitcar does not represent that the Platform or the Website will be available 100% of the time to meet your needs. We will strive to provide you with the Service on a continuous basis, but there is no guarantee that access will not be interrupted, or that there will be no delays, failures, errors, omissions or a loss of transmitted information."},
        {key:10.2, topText:"Bitcar will use reasonable endeavours to ensure that the Website and the Platform can be accessed by you in accordance with these Terms of Use. However, we may suspend use of the Website and the Platform for maintenance and will make reasonable efforts to give you notice of this. You acknowledge that this may not be possible in all cases, and accept the risks associated with the fact that you may not always be able to use the Website or the Platform to carry out urgent transactions."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="11" entryTitle="RESTRICTION OF SERVICES"
        subPoints={[{key:11.1, topText:"Depending on your location, you may not have access to all of the Services offered by Bitcar. It is your responsibility to follow the rules and laws applicable to your place of residence and/or place from which you access the Website and the Services."},
        {key:11.2, topText:"Bitcar will not be obliged to perform any obligation under these Terms of Use if the User would be in violation of, or exposed to punitive measures under sanctions or any other laws, regulations, statutes, prohibitions or restrictions imposed by the United States of America, the United Nations, the European Union, the United Kingdom, Singapore, Portugal, Canada, Australia or Switzerland and/or applicable to the User relating to the adoption, implementation and enforcement of economic sanctions, export controls, trade embargoes or other restrictive measures of any type whatsoever."},

      ]}
    />
    <TermsAndConditionEntry entryPoint="12" entryTitle="INTELLECTUAL PROPERTY RIGHTS"
        subPoints={[{key:12.1, topText:<React.Fragment>Unless otherwise indicated, all copyright and other intellectual property rights in all content and other materials contained on the Website or provided in connection with the Services, including, without limitation, the Bitcar logo and all designs, text, graphics, pictures, information, data, sound files, other files and the selection and arrangement thereof (collectively, “Bitcar Materials”) and computer source codes, programs, data files and other software (collectively, the “Software”) are the property of Bitcar and/or our licensors and suppliers and are protected by international copyright laws and other intellectual property rights laws. Copyright Notice and Disclaimer. The software /portions of the software incorporated herein is Copyright © of {BITCAR_ENTITY.entityName} (Bitcar {BITCAR_ENTITY.country}). All Rights Reserved. The name “Bitcar” (alone or as part of another name) or any logos, seals, insignia or other words, names, symbols or devices that identify Bitcar Singapore, Bitcar or any Bitcar division or affiliate may not be used to endorse or promote products derived from this software without specific prior written permission. <span className="uppercase">IN NO EVENT SHALL BITCAR SINGAPORE BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE, EVEN IF BITCAR SINGAPORE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BITCAR SINGAPORE SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS PROVIDED “AS IS”. BITCAR SINGAPORE HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS.”</span></React.Fragment>},
        {key:12.2, topText:"Bitcar grants you a limited, non-exclusive and non-transferable license to access and use the Bitcar Materials for your personal or internal business use. This license is subject to these Terms of Use and does not permit:",
          subPoints: [{key:"(a)", text:"	any resale of the Bitcar Materials; "},
          {key:"(b)", text:"	the distribution, public performance or public display of the Bitcar Materials;"},
          {key:"(c)", text:"	the modification or derivative use of the Bitcar Materials; or "},
          {key:"(d)", text:"	any use of the Bitcar Materials other than for their intended purpose."}]
        },
        {key:12.3, topText:"The license granted to you under these Terms of Use will automatically terminate if we terminate or suspend your access to the Services."},
      ]}
    />
    <TermsAndConditionEntry entryPoint="13" entryTitle="THIRD-PARTY CONTENT"
        subPoints={[{key:13.1, topText:<React.Fragment>In using the Services, you may view content provided by third parties, including links to web pages of such parties (<span className="terms-highlight">“Third-Party Content”</span>). Bitcar does not control, endorse or adopt any Third-Party Content and will have no responsibility for Third-Party Content, including without limitation material that may be misleading, incomplete, erroneous, offensive, indecent or otherwise objectionable. In addition, your business dealings or correspondence with such third parties are solely between you and the third parties. Bitcar will not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings, and you understand that your use of Third-Party Content, and your interactions with third parties, is at your own risk.</React.Fragment>},
      ]}
    />
    <TermsAndConditionEntry entryPoint="14" entryTitle="RISK DISCLOSURE"
        subPoints={[{key:14.1, topText:"Any activity related to the buying and selling of Digital Assets carries with it significant risk. Prior to using the Services, you should carefully consider the risks set out below and, to the extent necessary, consult a lawyer, accountant, and/or investment management professional."},
        {key:14.2, topText:"As a user of the Services, you acknowledge and agree that:",
          subPoints: [{key:"(a)", text:"	you are accessing and using the Services at your own risk and discretion;"},
          {key:"(b)", text:"	neither Bitcar, nor its respective directors, officers, members, employees, contractors, agents, affiliates, shareholders or partners are investment or trading advisors;"},
          {key:"(c)", text:"	none of the information provided by Bitcar is investment advice;"},
          {key:"(d)", text:<React.Fragment>	you are not entitled to a refund at any time or for any reason, without prejudice to your rights under these Terms of Use (please refer to our <Link to={URL_RETURNS_POLICY} target="_blank" className="link-highlight">Returns Policy</Link>);</React.Fragment>},
          {key:"(e)", text:"	the Digital Assets market is a dynamic area and the respective prices are often highly unpredictable and volatile. You should not deal in these products unless you understand their nature and the extent of your exposure to risk. You should also be satisfied that the product is suitable for you in light of your circumstances and financial position; "},
          {key:"(f)", text:"	the acquisition of Digital Assets can never be considered a safe investment but only an investment with a high risk of loss inherently associated with it. You should not have funds invested in Digital Assets or speculate in Digital Assets that you are not prepared to lose entirely; "},
          {key:"(g)", text:"	there are risks associated with utilising an internet-based platform including, but not limited to, the failure of hardware, software, revocation of required software licences to operate the Platform and internet connections. You acknowledge that Bitcar will not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience while using the Services;"},
          {key:"(h)", text:"	hackers or other groups or organisations may attempt to steal your Digital Assets or the revenue from your transactions;"},
          {key:"(i)", text:"	the Software rests on some open-source software including Solidity and MetaMask, and there is a risk that some weaknesses or bugs may be introduced into infrastructural elements of the Platform causing the loss of the Digital Assets stored in one or more of your Wallets;"},
          {key:"(j)", text:"	the blockchain used for the Services software is susceptible to mining attacks, including but not limited to double-spend attacks, majority mining power attacks, selfish-mining attacks and race condition attacks. Any successful attack presents a risk to the Software, expected proper execution and sequencing of the transactions, and expected proper execution and sequencing of computations;"},
          {key:"(k)", text:"	digital asset transactions are irrevocable and stolen or incorrectly transferred Digital Assets may be irretrievable.  Once a transaction has been verified and recorded in a block that is added to the blockchain, an incorrect transfer of Digital Assets or a theft of Digital Assets generally will not be reversible and there may be no compensation for any such transfer or theft;"},
          {key:"(l)", text:"	markets for Digital Assets have varying degrees of liquidity. Some are quite liquid while others may be thinner. Thin markets can amplify volatility and there is never a guarantee that there will be an active market for you to trade Digital Assets or products derived from or ancillary to them; "}, 
          {key:"(m)", text:"	values in any digital asset market are volatile and can shift quickly. Participants in any Digital Assets market should pay close attention to their position and holdings, and how they may be impacted by sudden and adverse shifts in trading and other market activities; and"},
          {key:"(n)", text:"	the legal status of certain Digital Assets may be uncertain. This can mean that the legality of holding or trading them is not always clear. Whether and how one or more Digital Assets constitute property, or assets, or rights of any kind may also seem unclear. You are responsible for knowing and understanding how Digital Assets will be addressed, regulated, and taxed under any applicable laws applying to them."}]
        },
        {key:14.3, topText:"The risk information presented in this section does not reflect all of the risks associated with the Services. Please consider these risks carefully and seek professional advice if anything in this section or in general is not clear to you. Do not use the Services until you are sure that you correctly understand all the associated risks."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="15" entryTitle="DISCLOSURE AND TRANSMISSION OF PERSONAL DATA"
        subPoints={[{key:15.1, topText:<React.Fragment>Bitcar may share your personal data and identifiers (<span className="terms-highlight">“Personal Data”</span>) with law enforcement, data protection authorities, government officials and other authorities when:</React.Fragment>,
          subPoints: [{key:"(a)", text:"	required by law;"},
          {key:"(b)", text:"	compelled by subpoena, court order, or other legal procedure;"},
          {key:"(c)", text:"	we believe that disclosure is necessary to prevent damage or financial loss to Bitcar;"},
          {key:"(d)", text:<span>disclosure is necessary to report suspected illegal activity; or
          <br />
          disclosure is necessary to investigate violations of these Terms of Use or our Privacy Policy.</span>}]
        },
        {key:15.2, topText:`Bitcar will store and process your Personal Data in data centres around the world, wherever Bitcar facilities or service providers are located. As such, we may transfer your Personal Data outside of ${LEGAL_ENTITY.country}.  For further information on how we process your Personal Data, please refer to the Privacy Policy.`},
      ]}
    />
    <TermsAndConditionEntry entryPoint="16" entryTitle="DISCLAIMER OF WARRANTIES"
        subPoints={[{key:16.1, topText:"Except as expressly provided to the contrary in a writing by Bitcar, the Services are provided on an “as is” and “as available” basis. To the fullest extent permitted by applicable law, we expressly disclaim, and you waive, all warranties of any kind, guarantee, declaration or condition, whether express or implied, including, without limitation, implied warranties of merchantability, market quality, commercial value, and fitness for a particular purpose, title and non-infringement as to our Services, including the information, content and materials contained therein."},
        {key:16.2, topText:"You acknowledge that information you store or transfer through the Services may become irretrievably lost or corrupted or temporarily unavailable due to a variety of causes, including software failures, protocol changes by third party providers, internet outages, force majeure, third party DDOS attacks, scheduled or unscheduled maintenance, or other causes either within or outside our control. You are solely responsible for backing up and maintaining duplicate copies of any information you store or transfer through the Services."}
      ]}
    />
    <TermsAndConditionEntry entryPoint="17" entryTitle="LIMITATION OF LIABILITY"
        subPoints={[{key:17.1, topText:"You acknowledge and agree that, to the fullest extent permitted by applicable law, the disclaimers of liability contained in these Terms of Use apply to any and all damages or injury whatsoever caused by or related to use of, or inability to use, the Services under any cause or action whatsoever of any kind in any jurisdiction, including, without limitation, actions for breach of warranty, breach of contract or tort (including negligence) and that Bitcar and  Agents will not be liable for any indirect, incidental, special, exemplary or consequential damages, including for loss of profits, goodwill or data, in any way whatsoever arising out of the use of, or inability to use, the Services, or purchase or sale of, or inability to purchase or sell CAR Tokens or any other Digital Assets. You also acknowledge that Bitcar is not liable for the conduct of third parties, including other users of the Services, and that the risk of using the Services rests entirely with you. Notwithstanding the foregoing, nothing in these Terms of Use will affect your statutory rights or exclude injury arising from any wilful misconduct or fraud of Bitcar."},
        {key:17.2, topText:"Bitcar, its affiliates and Agents will not be liable for:",        
          subPoints: [{key:"(a)", text:"	any failure on the part of Bitcar or the Agents to perform their obligations under these Terms of Use;"},
          {key:"(b)", text:"	any inaccuracy, error, delay in, or omission of any information or the transmission or delivery of information; or"},
          {key:"(c)", text:"	any loss or damage arising from any event beyond Bitcar or Bitcar Agents’ reasonable control, including but not limited to earthquake, flood, extraordinary weather conditions, fire, theft, malicious damage, law suits, war, insurrection, act of sabotage, riot, labour dispute, strike, accident, action of government, embargo, communications, delay or failure of any subcontract, power failure, accident to or breakdown or outage of computers, equipment or software malfunction, internet outages, internet latency, computer viruses, hacker attack, software licence revocations, voluntary or mandatory compliance with any governmental act, regulation or request, flaw in third-party services, public enemy, terrorist acts or any other cause beyond Bitcar and  Agents’ reasonable control."}]
        }
      ]}
    />
    <TermsAndConditionEntry entryPoint="18" entryTitle="INDEMNITY"
        text={<React.Fragment>You agree to defend, indemnify and hold harmless Bitcar, Agents and their respective directors, officers, members, employees, contractors, agents, affiliates, partners and their respective successors, heirs and assigns (collectively, the <span className="terms-highlight">“Bitcar parties”</span>), against any liability, damage, loss or expense (including reasonable attorneys' fees and expenses of litigation) incurred by or imposed upon the Bitcar parties, or any of them, in connection with any claims, suits, actions, damages, losses, costs, expenses, demands or judgments of third parties, including without limitation, personal injury and product liability matters or reasonable attorneys’ fees, arising out of or related to your breach and/or our enforcement of these Terms of Use or your violation of the rights of any third party.</React.Fragment>}
    />
    <TermsAndConditionEntry entryPoint="19" entryTitle="AMENDMENTS "
        text="Bitcar reserves the right to make changes or modifications to these Terms of Use from time to time, based on reasonable grounds. If we make changes to these Terms of Use, we will provide you with notice of such changes by posting the amended Terms of Use to the Website and by giving notice via the email address you provide us with.  You agree that the amended Terms of Use will be deemed effective immediately upon posting to the Website. Any amended Terms of Use will apply prospectively to use of the Services after such changes become effective. If you do not agree to any amended Terms of Use, you may discontinue using the Services."
    />
    <TermsAndConditionEntry entryPoint="20" entryTitle="NO WAIVER"
        text="Bitcar’s failure or delay in exercising any right, power or privilege under these Terms of Use will not operate as a waiver thereof."
    />
    <TermsAndConditionEntry entryPoint="21" entryTitle="SEVERABILITY"
        text="The invalidity or unenforceability of any of these Terms of Use will not affect the validity or enforceability of any other Terms of Use, all of which will remain in full force and effect."
    />
    <TermsAndConditionEntry entryPoint="22" entryTitle="ASSIGNMENT"
        text="You may not assign or transfer any of your rights or obligations under these Terms of Use without prior written consent from Bitcar, including by operation of law or in connection with any change of control. Bitcar and Agents may assign or transfer any or all of our rights under these Terms of Use, in whole or in part, to another entity pertaining to our group, without obtaining your consent or approval."
    />
    <TermsAndConditionEntry entryPoint="23" entryTitle="ENTIRE AGREEMENT"
        text="These Terms of Use contain the entire agreement and supersede all prior and contemporaneous understandings between the parties regarding the Services. These Terms of Use do not alter the terms or conditions of any other electronic or written agreement you may have with Bitcar for the Services or for any other Bitcar product or service or otherwise. In the event of any conflict between these Terms of Use and any other agreement you may have with Bitcar, the terms of that other agreement will only prevail if these Terms of Use are specifically identified and declared to be overridden by such other agreement."
    />
    <TermsAndConditionEntry entryPoint="24" entryTitle="GOVERNING LAW"
        text={`These Terms of Use will be governed by and construed in accordance with the laws of ${LEGAL_ENTITY.country} without regard to conflict of laws provisions, and the parties irrevocably submit any dispute in relation to these Terms of Use to the non-exclusive jurisdiction of the courts of that jurisdiction.`}
    />
    
  </div>
}
export default TermsAndConditions;