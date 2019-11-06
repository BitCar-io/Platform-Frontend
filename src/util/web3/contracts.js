import store from '../../store';
import { addDeployedContract } from '../../actions';
import { callEthereumMethod } from './web3Wrapper';

export const contractPath = '../../../build/contracts/';

export function loadContractIntoWeb3(contractAddress, contractJson, web3) {
    const contract = new web3.eth.Contract(contractJson["abi"], contractAddress);
    return contract;
}

// TODO remove this as no longer required
export async function loadPlatformWeb3Contract(contractJson, web3) {
    const netId = await web3.eth.net.getId();
    const address = contractJson.networks[netId].address;
    const loadedContract = loadContractIntoWeb3(address, contractJson, web3);
    return loadedContract;
}

export async function findContractByName(name) {
    const contracts = await store.getState().UIstate.contracts;
    const contractFound = contracts.find(x => name === x.contractName);
    return contractFound;
}

// searches for a contract in state by name, if it isn't loaded yet, loads it
export async function getOrLoadPlatformContract(contractName, web3) {
    
    // webpack is having an issue with using a dynamic pathname like 'contractPath', use string for now...
    const contract = await import('../../../build/contracts/' + contractName + '.json');
    const contractFound = await findContractByName(contract.contractName);
    if (contractFound) return contractFound.contract;

    const loadedContract = await loadPlatformWeb3Contract(contract, web3);
    store.dispatch(addDeployedContract(contract.contractName, loadedContract));
    return loadedContract;
}

export async function usdToBitCar(amountUsd) {

    if(!amountUsd || amountUsd === 0) {
        return 0;
    }

    const ticker = await findContractByName("Ticker");
    return await callEthereumMethod(ticker.contract.methods.usdToUnits(amountUsd));
}

export async function bitCarToUSD(amountBitCar) {
    const ticker = await findContractByName("Ticker");
    return await callEthereumMethod(ticker.contract.methods.unitsToUSD(amountBitCar));
}

export async function usdToEth(amountUsd) {
    const ticker = await findContractByName("Ticker");
    return await callEthereumMethod(ticker.contract.methods.ethToUnits(amountUsd));
}

export async function ethToUsd(amountEth) {
    const ticker = await findContractByName("Ticker");
    return await callEthereumMethod(ticker.contract.methods.unitsToETH(amountEth));
}

export function isValidContractAddress(address) {
    return address !== "0x0000000000000000000000000000000000000000";
}

export async function getDeployedNetworks() {
    const assetFactoryContract = await import('../../../build/contracts/AssetFactory.json');

    if(!assetFactoryContract || !assetFactoryContract.networks) {
        return undefined;
    }

    return Object.keys(assetFactoryContract.networks).map(networkId => parseInt(networkId));
}

export async function getBlockTimeStampAsDateTime(web3, blockNumber) {

    if(!web3 || !blockNumber) {
        return null;
    }

    const block = await web3.eth.getBlock(blockNumber).catch(error => {
        console.error(`Error getting block timestamp for block '${blockNumber}'`, error);
    });

    if(block && block.timestamp) {
        return new Date(block.timestamp * 1000);
    }

    return null;
}