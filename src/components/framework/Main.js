import React from "react";
import { Layout } from "antd";
import UIKit from "../UIKit";
import AssetsContainer from "./AssetsContainer";
import Dashboard from "../dashboard/Dashboard";
import { Switch, Route, Redirect } from "react-router-dom";
import RegisterAsset from '../register-asset/RegisterAsset';
import TraderRegistration from "../TraderRegistration";
import AssetSearch from '../asset-search/AssetSearch';
import Membership from '../membership/Membership';
import UserSettingsContainer from '../user-settings/UserSettingsContainer';
import Home from "../Home";
import TermsAndConditions from "../legal/TermsAndConditions";
import Escrow from "../faq/Escrow";
import PrivacyPolicy from "../legal/PrivacyPolicy";
import MembershipIntro from "../membership/MembershipIntro";
import StorageWallet from "../faq/StorageWallet";
import { URL_DASHBOARD, URL_ASSET, URL_SEARCH, URL_SETTINGS, URL_FAQ_ESCROW, URL_PRIVACY_POLICY, URL_TERMS_AND_CONDITIONS, URL_FAQ_STORAGE_WALLET, URL_TRADER_REGISTRATION, URL_MEMBERSHIP_REGISTRATION, URL_MEMBERSHIP_BASE, URL_REGISTER_ASSET, URL_HOME, URL_AML_POLICY, URL_RETURNS_POLICY, URL_CREDITCARD_PAYMENT, URL_CREDITCARD_RECEIPT, URL_REDEEM } from "../../util/platformNavigation";
import LegalWrapper from "../legal/LegalWrapper";
import AMLPolicy from "../legal/AMLPolicy";
import ReturnsPolicy from "../legal/ReturnsPolicy";
import CreditCardContainer from "../credit-card/CreditCardContainer";
import RedeemContainer from "../redeem-credit/RedeemContainer";

const { Content } = Layout;

class Main extends React.Component {
  render() {

    const alwaysAvailable = [
      <Route key={URL_HOME} exact path={URL_HOME} render={(props) => <Home {...props}  />} />,
      <Route key={URL_TERMS_AND_CONDITIONS} path={URL_TERMS_AND_CONDITIONS} render={() => <LegalWrapper scrollToTop={true}><TermsAndConditions /></LegalWrapper>} />,
      <Route key={URL_PRIVACY_POLICY} path={URL_PRIVACY_POLICY} render={() => <LegalWrapper scrollToTop={true}><PrivacyPolicy /></LegalWrapper>} />,
      <Route key={URL_AML_POLICY} path={URL_AML_POLICY} render={() => <LegalWrapper scrollToTop={true}><AMLPolicy /></LegalWrapper>} />,
    <Route key={URL_RETURNS_POLICY} path={URL_RETURNS_POLICY} render={() => <LegalWrapper scrollToTop={true}><ReturnsPolicy /></LegalWrapper>} />
];

    if(!this.props.isNetworkValid) {
      return <Content>
          <Switch>
            {alwaysAvailable}
            <Redirect to="/" />
          </Switch>
        </Content>
    }

    return (
      <Content className="content" style={{ minHeight: 280 }}>
        <Switch>
          {alwaysAvailable}
          <Route key={URL_CREDITCARD_PAYMENT} path={URL_CREDITCARD_PAYMENT} component={CreditCardContainer} />,
          <Route key={URL_CREDITCARD_RECEIPT} path={URL_CREDITCARD_RECEIPT} render={(props) => <CreditCardContainer {...props} paymentSent={true} />}  />
          <Route key={URL_REDEEM} path={URL_REDEEM} render={(props) => <RedeemContainer {...props}  />}  />
          <Route path={URL_DASHBOARD} render={(props) => <Dashboard {...props} />} history={this.props.history} />
          <Route path={`${URL_ASSET}:id`} render={(props) => <AssetsContainer {...props}  />}  />
          <Route path="/ui-kit" component={UIKit} />
          <Route path={URL_SEARCH} component={AssetSearch} />
          {/* <Route path="/agent-registration" component={AgentRegistration} /> */}
          <Route path={URL_MEMBERSHIP_REGISTRATION} component={MembershipIntro} />
          <Route path={`${URL_MEMBERSHIP_BASE}:rank?`} component={Membership} history={this.props.history} />
          <Route path={URL_TRADER_REGISTRATION} render={(props) => <TraderRegistration {...props} />} />
          <Route path={`${URL_REGISTER_ASSET}:step`} render={(props) => <RegisterAsset {...props} />} history={this.props.history} />
          <Route path={URL_SETTINGS} component={ UserSettingsContainer } />
          <Route path={URL_FAQ_ESCROW} component={ Escrow } />
          <Route path={URL_FAQ_STORAGE_WALLET} component={StorageWallet} />
          <Redirect to="/" />
        </Switch>
      </Content>
    );
  }
}

export default Main;
