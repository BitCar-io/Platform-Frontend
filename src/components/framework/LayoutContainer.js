import React from "react";
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { Layout, Row, Col } from "antd";
import Main from "./Main";
import HeaderContainer from '../header-bar/HeaderContainer';
import SubHeaderContainer from '../header-bar/SubHeaderContainer';
import PlatformError from "../error-pages/PlatformError";
import store from '../../store';

//styles
import "antd/dist/antd.css";
import "../../style/app.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FooterContent from "../FooterContent";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Footer } = Layout;

class LayoutContainer extends React.Component {
  state = {
    collapsed: false
  };

  render() {
    const isNetworkValid = this.props.connectedNetwork && this.props.connectedNetwork.isSupported;
    const platformErrorMessage = store.getState().UIstate.platformErrorMessage;
    const platformMessage = platformErrorMessage && platformErrorMessage.platformMessage;
    {platformMessage && console.error(platformErrorMessage.errorCode, platformErrorMessage.rawError)}
    return <Layout className={`${this.props.isBuyModalOpen ? "no-print" : "allow-layout-print"}`}>
        <HeaderContainer />
        {platformMessage && <PlatformError errorTitle={platformMessage.title} errorMessage={platformMessage.message} additionalMessage={platformErrorMessage.additionalMessage} />}
        {!platformMessage && <React.Fragment>
            <SubHeaderContainer />
            <Row className="main-content">
              <div className="print-header no-screen no-save">
                <img src={require("../../logos/logo_bitcar.png")} className="print-logo" alt="bitcar logo" />
                <div className='footer'>
                    Date of Printing: {new Date().toString()}
                </div>
              </div>
              <Col xs={24} lg={{ span: 18, offset: 3}} className="main-content-column">
                <Main isNetworkValid={isNetworkValid} history={this.props.history} />
              </Col>
            </Row>
          </React.Fragment> }
        <Footer>
          <FooterContent/>
        </Footer>
      </Layout>
  }
}
const mapStateToProps = (state) => {
    return {
      connectedNetwork: state.UIstate.connectedNetwork,
      isBuyModalOpen: state.UIstate.isBuyModalOpen
    }
}
export default withRouter(connect(mapStateToProps)(LayoutContainer));
