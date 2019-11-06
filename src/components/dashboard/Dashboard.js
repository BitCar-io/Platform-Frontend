import React from "react";
import { Modal, Button, Row, Col, Card, Icon } from "antd";
import LoadingIndicator from '../LoadingIndicator';
import { connect } from 'react-redux';
import PortfolioContainer from './PortfolioContainer';
import AgentListingContainer from './AgentListingContainer';
import AdminUnapprovedListings from './AdminUnapprovedListings';
import { getAssetDraft, deleteAssetDraft } from "../../util/assetDraftAPI";
import { Link } from "react-router-dom";
import { setDocumentTitle } from '../../util/helpers';
import { URL_REGISTER_ASSET, URL_HOME } from "../../util/platformNavigation";
import BalanceContainer from "./BalanceContainer";

class Dashboard extends React.Component {

  state = {
    registerModalShown: false
  }

  componentDidMount() {
    setDocumentTitle('My Garage');
  }

  handleRegister = () => {
    const draft = getAssetDraft();
    if (draft !== null) {
      this.setState({registerModalShown: true});
      return;
    }
    this.handleContinue();
  }

  handleStartFresh = () => {
    deleteAssetDraft();
    this.handleContinue();
  }

  handleContinue = () => {
    this.props.history.push(`${URL_REGISTER_ASSET}1`);
  }

  handleRegisterCancel = () => {
    this.setState({registerModalShown: false});
  }

  render() {
    return <div className="no-print">
            <Row>
              <Col sm={{span:24}} md={{span:24}} lg={{span:24}}>
                <div className="header-titles">
                  <h1 className="spec-title">
                    {this.props.currentUser && (!this.props.currentUser.isAdmin || !this.props.currentUser.isAgent || !this.props.currentUser.isSudo) && (!this.props.currentUser.canAccessUnapprovedAssets) && 'My Garage'}
                    {this.props.currentUser && this.props.currentUser.isAgent && 'Agent Dashboard'}
                    {this.props.currentUser && this.props.currentUser.isAdmin && 'Admin Dashboard'}
                    {this.props.currentUser && this.props.currentUser.isSudo && 'Sudo Dashboard'}
                  </h1>
                </div>
              </Col>
              <Col sm={{span:24}} md={{span:24}} lg={{span:24}}>
                {this.props.web3 && this.props.coinbase && this.props.currentUser && this.props.platformTokenContract && 
                  <BalanceContainer />
                }
              </Col>
            </Row>
            <br />

            { this.props.currentUser && this.props.currentUser.isAgent && <Row>
                <div className="card-heading">Agent Listings</div>
                <Button icon="plus" className="pull-right" style={{marginTop: '-40px'}} onClick={this.handleRegister}>
                  Register Asset
                </Button>
                <Modal title="Warning: Data exists in form"
                  visible={this.state.registerModalShown}
                  onCancel={this.handleRegisterCancel}
                  footer={[
                    <Button key="back" onClick={this.handleRegisterCancel}>Cancel</Button>,
                    <Button key="delete" onClick={this.handleStartFresh} className="btn btn-danger">Start fresh</Button>,
                    <Button key="submit" onClick={this.handleContinue} className="btn btn-info">Finish current application</Button>
                  ]}>
                  <Row>
                    <Col span={4}><Icon type="warning" className="font-50 text-warning" /></Col>
                    <Col span={20}>
                      <p> You have existing data in an unfinished application form, do you want to delete it and start fresh, or continue with the existing application?</p>
                    </Col>
                  </Row>
                </Modal>
                <Card className="dash-stat-card">
                  { (this.props.unapprovedAssets && this.props.loadedAssets && <AgentListingContainer />) || <LoadingIndicator /> }
                </Card>
              </Row> }

            { this.props.currentUser && this.props.currentUser.isAdmin && <Row>
                <div className="card-heading">Admin Listings Pending Approval</div>
                <Card className="dash-stat-card">
                  { (this.props.unapprovedAssets && <AdminUnapprovedListings />) || <LoadingIndicator /> }
                </Card>
              </Row> }

            <Row>
              { this.props.currentUser && (this.props.currentUser.isAdmin || this.props.currentUser.isAgent || this.props.currentUser.isSudo) && <div className="card-heading">
                  My Garage
              </div> }
              {(this.props.loadedAssets && <PortfolioContainer />) || <LoadingIndicator text="Opening the garage doors, Please Wait..." />}
            </Row>
      </div>
  }
}
const mapStateToProps = (state) => {
  return {
    web3: state.UIstate.web3,
    coinbase: state.UIstate.coinbase,
    loadedAssets: state.AssetState.loadedAssets,
    currentUser: state.UIstate.currentUser,
    unapprovedAssets: state.AssetState.unapprovedAssets,
    platformTokenContract: state.UIstate.platformTokenContract,
    bitcarDisplayBalance: state.UserState.bitcarDisplayBalance
  }
}
export default connect(mapStateToProps)(Dashboard);
