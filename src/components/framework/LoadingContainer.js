import React from "react";
import { connect } from 'react-redux';
import store from '../../store';
import { setAssetContracts, setPlatformTokenContract, setConnectedNetwork } from '../../actions';
import { loadAssets, loadLiveAssets } from '../../core/loadAssets.js';
import { getOrLoadPlatformContract } from '../../util/web3/contracts';
import {initialiseWeb3, subscribeToCoinbaseUpdates, getConnectedNetwork} from '../../core/web3Providers';
import cookieAcceptance from '../../util/cookieAcceptance';
import { loadAllAssetContracts } from '../../core/loadAssets';
import { createUser, loadDefaultUser, loadUserDashboard } from '../../core/user';
import {initialiseTicker} from '../../core/tickerRunner';
import { platformError } from "../../util/helpers";
import { ETHEREUM_NETWORK_FAILURE, ASSET_LOAD_FAILURE, CONTRACT_LOAD_FAILURE } from "../../util/web3/errorMessaging";
import ErrorWrapper from "../../classes/ErrorWrapper";
import MetaMaskRequired from '../error-pages/MetaMaskRequired';
import LoadingComponent from "../LoadingComponent";

const bitcar_logo = require('../../logos/logo_bitcar.png');

class LoadingContainer extends React.Component {

  constructor() {
    super();
    // console.log('Loading container constructing...');
    this.initialisePlatform();
  }

  async initialisePlatform() {

    const ethereumNetworkError = new ErrorWrapper(ETHEREUM_NETWORK_FAILURE, <MetaMaskRequired />);

    cookieAcceptance();
    const web3 = await initialiseWeb3().catch(error => {
      console.error('Initialising Web3', error);
      platformError(ethereumNetworkError);
    });

    if(!web3) {
      console.error('Web3 NULL');
      platformError(ethereumNetworkError);
      return;
    }

    if(process.env.NODE_ENV === 'development') {
      window.platformWeb3 = web3;
    }

    getConnectedNetwork(web3, false).then(async connectedNetwork => {
      
      if(!connectedNetwork) {
        console.error('Could not ID connected Network');
        platformError(ethereumNetworkError);
        return;
      }

      store.dispatch(setConnectedNetwork(connectedNetwork));

      console.log(`Connected to networkId: ${connectedNetwork.networkId} '${connectedNetwork.networkName}'`);

      if(!connectedNetwork.isSupported) {
        loadDefaultUser();
        return;
      }

      initialiseTicker(web3);

      subscribeToCoinbaseUpdates(web3);
  
      getOrLoadPlatformContract("PlatformToken", web3).then(contract => {
        store.dispatch(setPlatformTokenContract(contract));
      }).catch(error => {
        platformError(new ErrorWrapper(CONTRACT_LOAD_FAILURE));
      });

      const user = await createUser(null, web3, true);

      const assetContracts = await loadAllAssetContracts(web3);
      store.dispatch(setAssetContracts(assetContracts));
      
      // load all asset contracts then load all live assets, before loading the user garage (which includes unapproved assets)
      loadAssets(assetContracts, web3).then(allAssets => {
        loadLiveAssets(allAssets, web3).then(loadedAssets => {
          loadUserDashboard(allAssets, web3, user, loadedAssets).catch(error => {
            console.error('loadUserDashboard failure', error);
            platformError(new ErrorWrapper(ASSET_LOAD_FAILURE));
          });
        }).catch(error => {
          console.error('loadLiveAssets failure', error);
          platformError(new ErrorWrapper(ASSET_LOAD_FAILURE));
        });
      }).catch(error => {
        console.error('loadAssets failure', error);
        platformError(new ErrorWrapper(ASSET_LOAD_FAILURE));
      });
    }).catch(error => {
      console.error('Platform load error', error);
      platformError(ethereumNetworkError);
    });
  }

  render() {
    if (this.props.platformErrorMessage || (this.props.web3Status === 'intialised' && this.props.connectedNetwork)) {
        return React.Children.only(this.props.children);
    }
    return <LoadingComponent image={bitcar_logo} text="Platform is loading" />
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
export default connect(mapStateToProps)(LoadingContainer);
