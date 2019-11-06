import store from '../store';
import Web3 from 'web3'
import EthereumNetwork from '../classes/EthereumNetwork';
import { web3Initialised } from '../actions';
import { clearUserState, createUser, signoutUser } from './user';
import ConnectedNetwork from '../classes/ConnectedNetwork';
import { getDeployedNetworks } from '../util/web3/contracts';

export const initialiseWeb3 = async () => {
    return new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener('load', function(dispatch) {
    
            // console.log('window.web3', window.web3);
            // console.log('window.ethereum', window.ethereum);
    
            let provider = window.ethereum;

            if(!isValidEthereumProvider(provider) && process.env.REACT_APP_WEB3_WS_FALLBACK !== undefined) {

                if(!process.env.REACT_APP_WEB3_WS_FALLBACK) {
                    resolve(providerFallback());
                    return;
                }

                console.warn("Could not find web3 provider in browser (e.g. MetaMask), trying websocket provider:", process.env.REACT_APP_WEB3_WS_FALLBACK);

                provider = fallbackWebSocketProvider();
                provider.on("error", () => {

                    const uiState = store.getState().UIstate;
                    if(uiState.web3Status === 'intialised') {
                        reject('Failed after connection to provider.')
                        //resolve(connectProvider(provider));
                    } else {
                        resolve(providerFallback());
                    }
                });
                provider.on("connect", () => resolve(connectProvider(provider)));
            } else {
                resolve(connectProvider(provider));
            }
        });
    });
}

const isValidEthereumProvider = (provider) => {

    if(!provider) {
        return false;
    }

    if(!provider._metamask) {
        return true;
    }

    if (!provider.networkVersion || isNaN(parseInt(provider.networkVersion))) {
        return false;
    }
    
    return true;
}

const fallbackWebSocketProvider = () => {
    return new Web3.providers.WebsocketProvider(process.env.REACT_APP_WEB3_WS_FALLBACK);
}

const connectProvider = (provider) => {

        const web3 = new Web3(provider);

        const results = {
            web3Instance: web3
        }
    
        if(process.env.NODE_ENV === 'development') {
            window.platformWeb3 = web3;
        }
    
        // console.log('Connected provider', provider);
        store.dispatch(web3Initialised(results));
    
        return web3;
}

const providerFallback = () => {
    return new Promise((resolve, reject) => {
        try {
            console.warn("Could not connect to websocket fallback, attempting to connect to HTTPS provider.", process.env.REACT_APP_WEB3_HTTP_FALLBACK);
            let provider = new Web3.providers.HttpProvider(process.env.REACT_APP_WEB3_HTTP_FALLBACK);
            //provider.on('error', console.log('ERROR'));
            resolve(connectProvider(provider));
        } catch(error) {
            reject(error);
        }
    });
}

export const subscribeToCoinbaseUpdates = (web3) => {

    if(!window.ethereum && !web3.currentProvider.publicConfigStore) {
        // console.warn("Automatic coinbase updates not available for this Web3 provider, using polling mechanism.");
        // setTimeout(accountChangePoller, 2000, web3);
        console.warn("Automatic coinbase updates not available for this Web3 provider.");
        return;
    }

    if(!window.ethereum) {
        console.warn('No window.ethereum, using publicConfigStore for coinbase updates');
        web3.currentProvider.publicConfigStore.on('update', async () => {
            const ethCoinbase = await web3.eth.getCoinbase();
            accountChange(ethCoinbase, web3);
        });

        return;
    }

    window.ethereum.on('accountsChanged', function (accounts) {
        accountChange(accounts[0], web3);
      });
    
    return;    
}

const accountChangePoller = async (web3) => {

    if(!web3) {
        return;
    }

    web3.eth.getCoinbase().then(currentAccount => {
        accountChange(currentAccount, web3);
        setTimeout(accountChangePoller, 2000, web3);
    }).catch(error => {
        console.error('Error getting coinbase, polling for account changes has now stopped.', error);
    });
}

const accountChange = (account, web3) => {

    const state = store.getState();

    if(state.UserState.isUserLoggedOut) {
        return;
    }

    const currentCoinbase = state.UIstate.coinbase;
    const newCoinbase = account ? web3.utils.toChecksumAddress(account) : null;   

    if (currentCoinbase !== newCoinbase) {
        
        clearUserState();

        if (newCoinbase === null) {
            // user is not logged in anymore
            signoutUser();
        }

        createUser(newCoinbase, web3);
    }
}

export const getConnectedNetwork = async (web3, attemptingFallback) => {

    let supportedNetworkIds = await getDeployedNetworks();

    if(!supportedNetworkIds) {
        return undefined;
    }

    return new Promise(async (resolve, reject) => {
        
        if(!web3) {
            resolve(null);
            return;
        }

        try {
            web3.eth.net.getId().then(networkId => {

                const networkIdNumber = parseInt(networkId);
    
                const isDevelopment = process.env.REACT_APP_ETHNETWORK === 'DEVELOPMENT';
                       
                const allowedNetworkIds = isDevelopment ? supportedNetworkIds : [supportedNetworkIds[0]];
    
                let allowedNetworkNames = '';
    
                if(isDevelopment) {
                    let supportedNetworks = [];
    
                    supportedNetworkIds.forEach(networkId => {
                        if(supportedNetworks.find(network => network.id === networkId)) {
                            return;
                        }
    
                        supportedNetworks.push(getNetworkDetails(networkId));
                    });
    
                    allowedNetworkNames = `Development mode - supported networks: ${supportedNetworks.map(network => network.longName).join(',')}`;
    
                } else {
                    allowedNetworkNames = getNetworkDetails(supportedNetworkIds[0]).longName;
                }
    
                resolve(new ConnectedNetwork(getNetworkDetails(networkIdNumber), allowedNetworkIds, allowedNetworkNames));
            }).catch(error => {
    
                if(!attemptingFallback) {
    
                    getConnectedNetwork(new Web3(fallbackWebSocketProvider()), true).then(result => {
                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    });
                    return;
                }
    
                reject(error);
            });
        } catch(error) {
            reject(error);
        }
    });
}

export const getNetworkDetails = (networkIdNumber) => {
    switch (parseInt(networkIdNumber)) {
        case ETHEREUM_NETWORK_IDS.mainnet: {
            return new EthereumNetwork(networkIdNumber, 'mainnet', 'Main Ethereum Network', 'https://etherscan.io/');
        }
        case ETHEREUM_NETWORK_IDS.ropsten: {
            return new EthereumNetwork(networkIdNumber, 'ropsten', 'Ropsten Ethereum Test Network', 'https://ropsten.etherscan.io/');
        }
        case ETHEREUM_NETWORK_IDS.rinkeby: {
            return new EthereumNetwork(networkIdNumber, 'rinkeby', 'Rinkeby Ethereum Test Network', 'https://rinkeby.etherscan.io/');
        }
        case ETHEREUM_NETWORK_IDS.kovan: {
            return new EthereumNetwork(networkIdNumber, 'kovan', 'Kovan Ethereum Test Network', 'https://kovan.etherscan.io/');
        }
        default: {
            return new EthereumNetwork(networkIdNumber, 'devnet', 'Private or Unknown Network', process.env.NODE_ENV === 'development' ? 'https://wontworkdev' : undefined);
        }
    }
}

const getConnectionType = (web3) => {
    if (web3.currentProvider.host && web3.currentProvider.host == "metamask") {
        return 'metamask';
    }

    if (web3.currentProvider.host && (web3.currentProvider.host.indexOf('wss://') !== -1 || web3.currentProvider.host.indexOf('ws://') !== -1)) {
        return 'websocket';
    }

    if (web3.currentProvider.host && (web3.currentProvider.host.indexOf('https://') !== -1 || web3.currentProvider.host.indexOf('http://') !== -1)) {
        return 'tcp';
    }

    return 'unknown';
}

export const supportsEvents = (web3) => {

    if(!web3 || !web3.currentProvider) {
        return false;
    }

    // Get procotol from connection
    const connectionType = getConnectionType(web3);

    if(connectionType == "metamask" || connectionType == "websocket") {
        return true;
    }

    return false;
}

export const ETHEREUM_NETWORK_IDS = {
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    kovan: 5
}