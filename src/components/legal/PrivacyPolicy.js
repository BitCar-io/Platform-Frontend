import React from 'react';
import { CAR_TITLE_ENTITY, BITCAR_ENTITY } from '../../util/globalVariables';

const PrivacyPolicy = () => {

    const privacyEmailAddress= BITCAR_ENTITY.privacyEmail;

    return <div className="privacy-text">
    <h1>Bitcar Privacy Policy</h1>
    <p>
    By accepting this privacy policy you are giving your free, specific, informed and unambiguous consent for the collection of the personal data provided through this website, whose processing under the terms of the applicable legislation (Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data) shall comply with the appropriate technical and organizational security measures.
    </p>
    <p>
        This privacy policy will explain how our organization processes the personal data we collect from you when you use our website.
    </p>
    <p>Topics:</p>
    <ul>
        <li>What data do we collect?</li>
        <li>How do we collect your data?</li>
        <li>How will we process your data?</li>
        <li>How do we store your data?</li>
        <li>Marketing</li>
        <li>What are your data protection rights?</li>
        <li>What are cookies?</li>
        <li>How do we use cookies?</li>
        <li>What types of cookies do we use?</li>
        <li>How to manage your cookies</li>
        <li>Privacy policies of other websites</li>
        <li>Changes to our privacy policy</li>
        <li>How to contact us</li>
        <li>How to contact the appropriate authorities</li>
    </ul>

    <h2>What data do we collect?</h2>
    <p>Bitcar collects data according to your membership level (Bronze, Silver and Gold).
    </p>
    <p>Bitcar collects at least the following Personal identification information for all membership levels (Country of Residence, I.P address, Name, Date of Birth, email address).</p>
    <p>Bitcar will collect further Personal identification information for Silver and Gold levels, which may include Photo identification and Proof of Address.</p>

    <h2>How do we collect your data?</h2>
    <p>You directly provide Bitcar with most of the data we collect. We collect data and process your data when you:</p>
    <ul>
        <li>Register online or place an order for any of our products or services.</li>
        <li>Voluntarily complete a customer survey or provide feedback on any of our message boards or via email.</li>
        <li>Use or view our website via your browser’s cookies.</li>
    </ul>
    <p>
    Bitcar may also receive your data indirectly from any third parties that it may use to verify information about its members or their crypto funds.
    </p>

    <h2>How will we use your data?</h2>
    <p>
    Bitcar will process your data solely for the following purposes:
    </p>
    <ul>
    <li>Process your order, for AML and KYC compliance and to manage your account.</li>
    <li>Email you with special offers on other products and services we think you might like.</li>
    <li>Provide generic information about the location of our buyers.</li>
    </ul>
    <p>
    If you agree, Bitcar will share your data with our partner companies so that they may offer you their products and services.
    </p>
    <ul>
    <li>Ledger Assets Pty Ltd</li>
    <li>{CAR_TITLE_ENTITY.entityName}</li>
    <li>{BITCAR_ENTITY.entityName}</li>
    </ul>
    <p>
    When Bitcar processes your order, it may send your data to, and also use the resulting information from, credit reference agencies or other similar agencies who specialize in tracking cryptocurrency, to prevent fraud or cryptocurrency money laundering.
    </p>

    <h2>How do we store your data?</h2>
    <p>Bitcar or its partners securely store your data at one of our data centres. The data is archived regularly, so that in the hopefully unlikely event a hack occurred, minimal data would be available to the hackers.
    </p>
    <p>
    Bitcar will keep the data for up to 10 years. Once this time period has expired, we will delete your data by destroying electronic files containing the data.
    </p>

    <h2>Marketing</h2>
    <p>
    Bitcar would like to send you information about products and services of ours that we think you might like, as well as those of our partner companies. All communications of this type will be directed exclusively to users who have given prior and express authorization. If you have agreed to receive marketing, you may always opt out at a later date.
    You have the right at any time to stop Bitcar from contacting you for marketing purposes or giving your data to other members of the Bitcar Group.
    If you no longer wish to be contacted for marketing purposes, please <a href={`mailto:${privacyEmailAddress}?subject=Remove From Marketing`}>click here to send us an email</a>.
    </p>

    <h2>What are your data protection rights?</h2>
    <p>Bitcar would like to make sure you are fully aware of all of your data protection rights. According to the GDPR, the user is entitled to the following:
    </p>
    <p><span className="terms-highlight">The right to access – </span>You have the right to request Bitcar confirmation as to whether or not personal data concerning you is being processed and if so, access to copies of your personal data. We may charge you a small fee (to cover administrative costs) for providing copies of the information collected.
    </p>
    <p><span className="terms-highlight">The right to rectification – </span>You have the right to request that Bitcar correct any information you believe is inaccurate. You also have the right to request Bitcar to complete the information you believe is incomplete.</p>
    <p><span className="terms-highlight">The right to erasure – </span>You have the right to request that Bitcar erase your personal data, under certain conditions.</p>
    <p><span className="terms-highlight">The right to restrict processing – </span>You have the right to request that Bitcar restrict the processing of your personal data, under certain conditions.</p>
    <p><span className="terms-highlight">The right to object – </span>You have the right to object to Bitcar’s processing of your personal data, under certain conditions.</p>
    <p><span className="terms-highlight">The right to data portability – </span>You have the right to request that Bitcar transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
    <p>If you make a request, we have 30 days to respond to your request. If you would like to exercise any of these rights, please contact us at our email:  <a href={`mailto:${privacyEmailAddress}`}>{privacyEmailAddress}</a></p>

    <h2>Cookies</h2>
    <p>
    Cookies are text files placed on your computer to collect standard Internet log information and visitor behaviour information. When you visit our websites, we may collect information from you automatically through cookies or similar technology</p>
    <p>
    For further information, visit <a rel="noopener noreferrer" href='https://allaboutcookies.org/' target='_blank'>https://allaboutcookies.org/</a>.
    </p>

    <h2>How do we use cookies?</h2>
    <p>Bitcar uses cookies in a range of ways to improve your experience on our website, including:</p>
    <ul>
    <li>Understanding how you use our website</li>
    <li>Marketing</li>
    </ul>

    <h2>What types of cookies do we use?</h2>
    <p>
    There are a number of different types of cookies, however, our website uses:
    </p>
    <ul>
    <li>Functionality – Bitcar uses these cookies so that we recognize you on our website and remember your previously selected preferences. These could include what language you prefer and location you are in. A mix of first-party and third-party cookies are used.</li>
    <li>Advertising – Bitcar uses these cookies to collect information about your visit to our website, the content you viewed, the links you followed and information about your browser, device, and your IP address. Bitcar sometimes shares some limited aspects of this data with third parties for advertising purposes. We may also share online data collected through cookies with our advertising partners. This means that when you visit another website, you may be shown advertising based on your browsing patterns on our website.</li>
    </ul>

    <h2>How to manage cookies</h2>
    <p>
    You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.
    </p>

    <h2>Privacy policies of other websites</h2>
    <p>
    The Bitcar website contains links to other websites. Our privacy policy applies only to our website, so if you click on a link to another website, you should read their privacy policy.
    </p>

    <h2>Changes to our privacy policy</h2>
    <p>
    Bitcar keeps its privacy policy under regular review and places any updates on this web page. This privacy policy was last updated on 9 January 2019.
    </p>

    <h2>How to contact us</h2>
    <p>
    If you have any questions about Bitcar’s privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.
    </p>
    <p>
    Email us at: <a href={`mailto:${privacyEmailAddress}`}>{privacyEmailAddress}</a>
    </p>

    <h2>How to contact the appropriate authority</h2>
    <p>
    Should you wish to report a complaint or if you feel that Bitcar has not addressed your concern in a satisfactory manner, you may contact the E.U Information Commissioner’s Office. Alternatively, you may contact the relevant data protection authority within your jurisdiction if and where applicable.
    </p>
</div>
}
export default PrivacyPolicy;