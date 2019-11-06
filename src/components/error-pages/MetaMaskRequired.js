import React from 'react';
import { Card} from "antd";

const MetaMaskRequired = () => {
    return <Card className="error-metamask-required">
        <h2>
            This error usually occurs when you do not have MetaMask installed and we cannot connect to the Blockchain.
        </h2>
        <h3>
            Please download and install MetaMask <a rel="noopener noreferrer" href="https://metamask.io" target="_blank" title="Open MetaMask website in a new window">from their website</a> and reload the BitCar platform.
        </h3>
        <a rel="noopener noreferrer" href="https://metamask.io" target="_blank" title="Open MetaMask website in a new window">
            <img id="metamask-logo" src={require('../../logos/wallets/metamask-fox.svg')} />
        </a>
        <h3>If you have MetaMask installed, please ensure you have selected the 'Main Ethereum Network'</h3>
        <img src={require('../../img/metamask-main-eth-network.jpg')} className="metamask-mainnet" />
    </Card>
}
export default MetaMaskRequired;