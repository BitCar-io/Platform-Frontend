import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';

const metamask_logo = require('../logos/wallets/metamask-fox.svg');

class AddTokenToMetaMask extends React.Component {

    addTokenToMetaMask = () => {

        const hasAllRequiredProps = this.props.address && this.props.symbol && this.props.imageUrl;

        if(!window.ethereum || !hasAllRequiredProps) {
            return;
        }

        let symbol = this.props.symbol.replace('-', '');
        if(symbol.length > 6) {
            symbol = symbol.substring(0, 5);
        }

        const metamaskParams = {
            "type":"ERC20", // Initially only supports ERC20, but eventually more!
            "options":{
                "address": this.props.address, // The address that the token is at.
                "symbol": symbol, // A ticker symbol or shorthand, up to 6 chars.
                "decimals": 8, // The number of decimals in the token
                "image": this.props.imageUrl, // A string url of the token logo
            }
        };

        //console.log("Adding to metamask...", metemaskParams);
    
        window.ethereum.sendAsync({
            method: 'metamask_watchAsset',
            params: metamaskParams,
            id: Math.round(Math.random() * 100000),
        }, (err, addedBoolean) => {
            if(err || !addedBoolean || !addedBoolean.result) {
                console.error("Error adding car balance to MetaMask. Error:", err);
                console.error("Result after add:", addedBoolean);
            }
        });
    }

    render() {
        const hasAllRequiredProps = this.props.address && this.props.symbol && this.props.imageUrl;
        return (
            hasAllRequiredProps && <Tooltip title={'Click to show balance in MetaMask'}>
            <div className={this.props.className ? this.props.className : "addtoken-wrapper"} onClick={this.addTokenToMetaMask}>
                {this.props.children}
                {!this.props.children && <React.Fragment>
                        <img src={metamask_logo} width={20} /> {this.props.showMetaMaskText && 'Show balance in MetaMask' }
                    </React.Fragment>
                }
            </div>
        </Tooltip>
        ) || this.props.children || "";
    }
}

AddTokenToMetaMask.propTypes = {
    showMetaMaskText: PropTypes.bool,
    className: PropTypes.string,
    symbol: PropTypes.string,
    address: PropTypes.string,
    imageUrl: PropTypes.string
};

AddTokenToMetaMask.defaultProps = {
    showMetaMaskText: false
};

export default AddTokenToMetaMask;
