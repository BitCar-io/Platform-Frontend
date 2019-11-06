import React from 'react';
import { Card, Icon, Row, Col, Button, Modal, Form, Input, Select } from "antd";
import { connect } from 'react-redux';
import * as _ from 'lodash';
import NewChangeRequestModal from './NewChangeRequestModal';
import ChangeRequestModal from './ChangeRequestModal';

class ChangeRequestList extends React.Component {
    state = {
        changeRequestModalAddress: undefined,
        newChangeRequestModalShown: false
    }

    componentDidMount() {
        // console.log('agent listing loadedAssets', this.props.loadedAssets);
    }

    openNewChangeRequestModal = () => {
        this.setState({newChangeRequestModalShown: true})
    }
    closeNewChangeRequestModal = () => {
        this.setState({newChangeRequestModalShown: false})
    }

    openChangeRequestModal = (tokenAddress) => {
        this.setState({changeRequestModalAddress: tokenAddress})
    }
    closeChangeRequestModal = () => {
        this.setState({changeRequestModalAddress: undefined})
    }

    render() {
        // console.log(this.props.portfolioAssets);
        return <React.Fragment>
            <div className="card-heading pull-left">
                Car Change Requests
            </div>
            <Button size="small" className="pull-right" style={{ position: 'relative', top: 20 }} onClick={this.openNewChangeRequestModal}>
                <Icon type="plus"></Icon> Create Request
            </Button>
            <Card className="dash-stat-card clear-pull">
                <div className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Transaction Hash</th>
                                <th>Owner Address</th>
                                <th>Expiry Date</th>
                                <th>Vote %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="clickable" onClick={() => this.openChangeRequestModal('FF40-88')}>
                                <td>FF40-88</td>
                                <td>Storage</td>
                                <td>Pending</td>
                                <td>0x043044</td>
                                <td>0x12435677</td>
                                <td>13/04/2019</td>
                                <td>5%</td>
                            </tr>
                            <tr className="clickable" onClick={() => this.openChangeRequestModal('BVEY-08')}>
                                <td>BVEY-08</td>
                                <td>Promotion</td>
                                <td>Pending</td>
                                <td>0x023044</td>
                                <td>0x12435677</td>
                                <td>13/04/2019</td>
                                <td>13%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
            <NewChangeRequestModal newChangeRequestModalShown={this.state.newChangeRequestModalShown} 
                    closeNewChangeRequestModal={this.closeNewChangeRequestModal} portfolioAssets={this.props.portfolioAssets} />
            <ChangeRequestModal changeRequestModalAddress={this.state.changeRequestModalAddress} closeChangeRequestModal={this.closeChangeRequestModal} />
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      portfolioAssets: state.UserState.portfolioAssets,
      currentUser: state.UIstate.currentUser,
      loadedAssets: state.AssetState.loadedAssets
    }
  }
export default connect(mapStateToProps)(ChangeRequestList);