import React from 'react';
import { connect } from 'react-redux';
import { getNetworkDetails } from '../../core/web3Providers'
import Login from '../header-bar/Login';

class StepPreliminaryChecks extends React.Component {
    errors = {
        metamaskNotInstalled: {
            title: <h2>MetaMask is not installed</h2>,
            content: <span>In order to claim tokens you need to install the MetaMask extension. For help setting this up, please refer to <a href="https://go.bitcar.io/metamask" target="_blank">our MetaMask setup guide</a>.</span>
        },
        metamaskNoAccess: {
            title: <h2>Please grant access to BitCar in MetaMask</h2>,
            content: <span>Please <Login unlockButtonText=" Unlock your Wallet" unlockButtonClass="ant-btn ant-btn-lg" /> to continue.</span>
        },
        invalidCoinbase: {
            title: <h2>Please select a valid Ethereum address (account) in MetaMask</h2>,
            content: <span>Please make sure that Metamask has a valid Ethereum address (account) selected</span>
        }
    }

    state = {
        error: null,
        connected: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.runPreChecks();
    }

    componentDidUpdate(prevprops) {
        if(!this.state.error) {
            this.props.setCurrentStep(1);
        }

        if(prevprops.coinbase !== this.props.coinbase || prevprops.connectedNetwork !== this.props.connectedNetwork) {
            this.runPreChecks();
        }
    }

    invalidNetworkError = () => {
        return {
            title: <h2>Incorrect network detected</h2>,
            content: <span>To use BitCar you need to connect to '{this.props.connectedNetwork.allowedNetworkNames}' (Id: {this.props.connectedNetwork.allowedNetworkIds}) - please select this network in MetaMask.</span>
        }
    }

    runPreChecks = () => {
        if(!window.ethereum) {
            return this.setState({error: this.errors.metamaskNotInstalled});
        }

        if(!this.props.coinbase) {
            return this.setState({error: this.errors.metamaskNoAccess});
        }

        if(!this.props.connectedNetwork.isSupported) {
            return this.setState({error: this.invalidNetworkError()});
        }

        return this.setState({error: null, connected: true});
    }

    render() {
        if(!this.state.error) {
            return (<div><h2>Connected successfully to MetaMask</h2></div>);
        }

        return (
            <div>
                {this.state.error.title}
                {this.state.error.content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3,
        web3Status: state.UIstate.web3Status,
        connectedNetwork: state.UIstate.connectedNetwork,
        assetContracts: state.AssetState.assetContracts,
        coinbase: state.UIstate.coinbase,
        platformErrorMessage: state.UIstate.platformErrorMessage
    }
}

export default connect(mapStateToProps)(StepPreliminaryChecks);
// export default StepPreliminaryChecks;