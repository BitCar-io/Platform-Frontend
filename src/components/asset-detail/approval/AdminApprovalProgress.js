import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col, Row, Select} from 'antd';
import { connect } from 'react-redux';
import "@fortawesome/fontawesome-free/css/all.min.css";
import ApprovalStep from './ApprovalStep';
import { Link } from "react-router-dom";
import CreateAssetToken from './CreateAssetToken';
import SetBitCarPercent from './SetBitCarPercent';
import CreateFeeManagerAndFees from './CreateFeeManagerAndFees';
import { URL_ALL_ASSETS } from '../../../util/platformNavigation';

const Option = Select.Option;

class AdminApprovalProgress extends React.Component {

    state = {
        pending: false
    }

    componentDidMount() {
        
    }

    createWhitelistContract = async () => {

    }

    approveAsset = async () => {

    }

    render() {
        const assetContract = this.props.assetContract;
        const createWhitelistButton = <Button size="large" onClick={this.createWhitelistContract} disabled={this.state.pending} loading={!this.state.pending}>Create Whitelist</Button>;
        const approveButton = <Button size="large" onClick={this.approveAsset} disabled={this.state.pending} loading={!this.state.pending}>Approve Asset</Button>;
        const doneMessage = <Link to={URL_ALL_ASSETS}><Button className="btn" size="large">Back to car list</Button></Link>;
        const currentStep = assetContract.adminApprovalProgress + 1;
        
        return <div className="approval-step-container">
            <Row>
                {/* When not in modal...
                 <Col m={{span: 18, offset: 2}} xl={{span: 16, offset: 4}} xxl={{span:14, offset:6}}> */}
                <Col m={{span: 18, offset: 2}} xl={{span: 16, offset: 4}} xxl={{span:16, offset:4}}>
                    <h1>Administrator - Approve Car on the Platform</h1>

                    <Alert style={{ marginBottom: 12 }}  
                        message={<div>At this stage we will create all required contracts for this new car on the blockchain, this is a 5-step process<br />Approval will not be finalised until each step has been completed, however, you do not have to complete them all at once.<br />Please ensure you have Metamask installed and unlocked.</div>}
                        type="warning" 
                        showIcon />
                    <br />

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={1}
                        title="Step 1/5 - Create car tokens" 
                        description="Create the actual blockchain contract which will control the tokens available for this car." 
                        alert={"Please check Metamask and confirm the transaction."}>
                        <CreateAssetToken assetContract={assetContract} currentUser={this.props.currentUser}/>
                    </ApprovalStep>

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={2}
                        title="Step 2/5 - Set BITCAR / ETH sale percentages" 
                        description="Set the percentage split for purchasing each car token (% BITCAR and % ETH)" 
                        alert={"Please check Metamask and confirm the transaction."}>
                        <SetBitCarPercent assetContract={assetContract} currentUser={this.props.currentUser}/>
                    </ApprovalStep>

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={3}
                        title="Step 3/5 - Create Fees" 
                        description="Create the actual blockchain contracts which will control the fees and escrow received for this car."
                        showDescription={currentStep !== 3}>
                        <CreateFeeManagerAndFees assetContract={assetContract} currentUser={this.props.currentUser}/>
                    </ApprovalStep>

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={4}
                        button={createWhitelistButton} 
                        title="Step 4/5 - Create Whitelist" 
                        description="Create the actual blockchain contract which will control the whitelist of addresses whom can purchase car tokens." 
                        alert={"Please check Metamask and confirm the transaction."} />

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={5}
                        button={approveButton} 
                        title="Step 5/5 - Approve listing" 
                        description="Sets the approval flag for the car and notifies the agent in their dashboard. The next step is for the Agent to approve the car contracts. This process may take several days before the asset is live on the platform." 
                        alert={"Please check Metamask and confirm the transaction."} />

                    <ApprovalStep currentStep={currentStep}
                        stepNumber={6}
                        title="Registration complete" 
                        description="Asset submitted for Admin approval. This process may take several days before the asset is live on the platform."
                        button={doneMessage}
                        isLastStep={true} />
                </Col>
            </Row>

        </div>
    }
}

AdminApprovalProgress.propTypes = {
    assetContract: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      web3: state.UIstate.web3,
      currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(AdminApprovalProgress);