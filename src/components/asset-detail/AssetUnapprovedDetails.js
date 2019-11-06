import React from 'react';
import { Card, Row, Col, Button, Modal, Form } from 'antd';
import BlockchainAddressToolTip from '../BlockchainAddressToolTip';
import { secondsToYearsString } from '../../util/helpers';
import { assetApprovalState, setApprovalState } from '../../util/assetHelpers';
import AdminApprovalProgress from './approval/AdminApprovalProgress';
import AssetSupportingDocs from './AssetSupportingDocs';

class AssetUnapprovedDetails extends React.Component {

    state = {
        adminApprovalModalShown: false,
        tokenCode: undefined,
        votingPeriod: 14,
        bitcarSplit: 20,
        BEE: 8,
        releaseDelayPeriod: 14,
        approvalVisible: false
    }
    
    handleApprove = () => {
        this.setState({adminApprovalModalShown: true});
    }

    handleCancel = () => {
        this.setState({adminApprovalModalShown: false});
    }

    handleSubmit = (event) => {
        console.log('submitted', event)
    }

    render() {
        const loadedAsset = this.props.asset;
        const tradingPeriodString = secondsToYearsString(loadedAsset.tradingPeriodDuration);
        const approvalTitle = <React.Fragment>Administrator Approval for {`${loadedAsset.data.year} ${loadedAsset.data.make} ${loadedAsset.data.model} | $${loadedAsset.listedValueUsdDisplay} | ${tradingPeriodString} | ${loadedAsset.address}`}</React.Fragment>
        const supportingDocuments = loadedAsset.data ? loadedAsset.data.supportingDocuments : undefined;

        return <Card className="dash-stat-card">
            <Row gutter={16}>
                <Col xs={{span:24}} lg={{span:12}}>
                    <h1>{setApprovalState(loadedAsset.approvalState)}.</h1>
                    <div className="font-16">
                        <div><span className="text-white">List price:</span> ${ loadedAsset.listedValueUsdDisplay }</div>
                        <div><span className="text-white">Term:</span> {tradingPeriodString}</div>
                        { this.props.currentUser.isAdmin && <span><div><span className="text-white">Agent:</span> <BlockchainAddressToolTip address={ loadedAsset.agent }/></div>
                        <div><span className="text-white">Agent bitcar balance:</span> { this.props.agentBitcarBalance }</div></span> }
                    </div>
                    <br />

                    { this.props.currentUser.isAgent && loadedAsset.approvalState === assetApprovalState.PENDING_AGENT_DATA_APPROVAL && <div><Button onClick={this.props.approveAsset}>Approve Asset Data</Button></div>}
                    { this.props.currentUser.isAgent && loadedAsset.approvalState === assetApprovalState.PENDING_AGENT_CONTRACT_APPROVAL && <div><Button onClick={this.props.approveAsset}>Approve Asset</Button> <Button onClick={this.props.rejectAsset}>Reject Asset</Button> </div>}
                    { this.props.currentUser.isAgent && loadedAsset.approvalState === assetApprovalState.PENDING_ADMIN_DATA_APPROVAL && <p>Please wait while the details are verified by admin.</p> }


                    {/* Modal*/}
                    { this.props.currentUser.isAdmin && loadedAsset.approvalState === assetApprovalState.PENDING_ADMIN_DATA_APPROVAL && <div><Button onClick={this.handleApprove}>Approve Asset</Button> <Button onClick={this.props.rejectAsset}>Reject Asset</Button> </div>}
                    {
                        this.props.currentUser.isAdmin && loadedAsset.approvalState === assetApprovalState.PENDING_ADMIN_DATA_APPROVAL &&
                        <Modal title={approvalTitle}
                            visible={this.state.adminApprovalModalShown}
                            onCancel={this.handleCancel}
                            style={{top: 2}}
                            width="60%"
                            footer={[<Button key="cancel" onClick={this.handleCancel}>Cancel</Button>,
                                    <Button key="approve" onClick={this.handleSubmit}>Approve</Button>]}>
                            <AdminApprovalProgress assetContract={loadedAsset} />                        
                        </Modal>
                    }

                    <br />
                </Col>
                {supportingDocuments && <Col xs={{span:24}} lg={{span:12}}>
                    <AssetSupportingDocs supportingDocuments={supportingDocuments} />
                </Col>}
            </Row>
        </Card>
    }
}
export default Form.create()(AssetUnapprovedDetails);