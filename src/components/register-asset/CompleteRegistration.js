import React from 'react';
import {ipfsApiConnection} from '../../util/helpers';
import { Button, Card, Alert, Select, Input, Icon} from 'antd';
import {USER_EVENT_AGENTASSET_CREATE, startUserEvent} from '../../util/web3/eventHelper';
import { deleteAssetDraft } from '../../util/assetDraftAPI';
import { getOrLoadPlatformContract } from '../../util/web3/contracts';
import store from '../../store';
import { addUnapprovedAsset } from '../../actions';
import { connect } from 'react-redux';
import "@fortawesome/fontawesome-free/css/all.min.css";
import RegistrationStep from './registrationStep';
import { Link } from "react-router-dom";
import { URL_HOME } from '../../util/platformNavigation';

const Option = Select.Option;

class CompleteRegistration extends React.Component {

    state = {
        pending: false,
        createContractPrompt: true,
        creatingContract: false,
        settingDataHash: false,
        done: false
    }
    
    pushDataToIPFS = async (dataFile) => {
        console.log('pushing data to ipfs', dataFile);
        const content = ipfsApiConnection.types.Buffer.from(JSON.stringify(dataFile));
        const hash = await ipfsApiConnection.add(content);
        return hash;
    }

    createAssetContract = async () => {

        this.setState({pending: true, creatingContract: true})

        const hash = await this.pushDataToIPFS(this.props.draftForm);
        console.log('returned hash', hash[0].hash);

        const AssetFactory = await getOrLoadPlatformContract('AssetFactory');

        console.log("AssetFactory", AssetFactory);

        // register one-off event for when the asset has been created
        // NB: there is a platform event that will pickup when the asset has been created and when the data hash has been set
        AssetFactory.once('ContractCreated', {filter:{createdBy: this.props.coinbase}}, (error, event) => {

            console.log("Creation Event fired!", event);
            this.setState({creatingContract: false, createContractPrompt: false, settingDataHash: true})

            let setDataHash = new Promise(async (resolve, reject) => {

                const assetAddress = event.returnValues.contractAddress;
                const AssetContract = await import('../../../build/contracts/Asset.json');
                const asset = new this.props.web3.eth.Contract(AssetContract['abi'], assetAddress);
                console.log('asset received from event', asset);

                // Approval call with setHash
                const setHashResult = await asset.methods.agentApproveData(hash[0].hash).send({from: this.props.coinbase});
                this.setState({pending: false, settingDataHash: false, done: true})
                // OR setHash on its own
                // const setHashResult = await asset.methods.setDataHash(hash[0].hash).send({from: this.props.coinbase});

                // TODO check if data hash has already been set, we can decide how to allow overriding

                // TODO check if data hash was set successfully
                console.log('hash result', setHashResult);
            });
        });

        // TODO check if there is a 'ghost' asset without a data hash, if so, use that one instead of creating one

        const assetContractTxn = await AssetFactory.methods.create().send({from: this.props.coinbase});
        console.log('assetContractTransactionResult', assetContractTxn);
    }

    render() {
        const createAssetButton = <Button size="large" onClick={this.createAssetContract} disabled={this.state.pending} loading={!this.state.created && this.state.pending}>Create asset</Button>;
        const doneMessage = <Link to={URL_HOME}><Button className="btn" size="large">Back to car listing</Button></Link>;
        
        return <div className="reg-step-container">

            <h1>Submit asset for admin approval</h1>

            <Alert style={{ marginBottom: 12 }}  
                message="At this stage we will submit the asset to the blockchain, this a 2-step process so please do not leave or refresh the page until you see 'Registration Complete'. Please ensure you have Metamask installed and unlocked."
                type="warning" 
                showIcon />
            <br />
            
            <RegistrationStep status={this.state.createContractPrompt ? 'current' : 'complete'} 
                button={createAssetButton} 
                title="Create asset contract" 
                description="Create the actual blockchain contract for this asset." 
                alert={this.state.creatingContract && "Please check Metamask and confirm the transaction."} />

            <i className="reg-step-arrow fas fa-2x fa-caret-down"></i>

            <RegistrationStep status={this.state.settingDataHash ? 'current' : (this.state.done ? 'complete' : 'incomplete')} 
                title="Attach ipfs data to contract" 
                description="Car data is stored seperately in a decentralized network called ipfs, this step adds a reference to it in the blockchain contract."
                alert={this.state.settingDataHash && "Please check Metamask for another transaction and confirm hit the confirm button."} />
            
            <i className="reg-step-arrow fas fa-2x fa-caret-down"></i>

            <RegistrationStep status={this.state.done ? 'current' : 'incomplete'} 
                title="Registration complete" 
                description="Asset submitted for Admin approval. This process may take several days before the asset is live on the platform."
                button={this.state.done && doneMessage} />

        </div>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      web3: state.UIstate.web3,
      currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(CompleteRegistration);
