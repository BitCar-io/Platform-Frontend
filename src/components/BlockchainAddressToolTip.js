import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import LinkToEtherScan from './LinkToEtherScan';
import ClipboardJS from 'clipboard';
import AddTokenToMetaMask from './AddTokenToMetaMask';
import { trimAddress } from '../util/helpers';

class BlockchainAddressToolTip extends React.Component {
    
    defaultText = "Click to copy to clipboard";

    constructor(props) {
        super(props)

        this.state = {tooltipText: this.defaultText};
    }

    componentDidMount() {

        this.clipboard = new ClipboardJS('#copy-address');

        const context = this;

        this.clipboard.on('success', function(e) {
            context.setState({tooltipText: "Copied!"});
            e.clearSelection();
        });

        this.clipboard.on('error', function(e) {
            context.setState({tooltipText: "Could not copy, please use Ctrl+C on keyboard"});
        });

    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    setDefaultText = () => {
        this.setState({tooltipText: this.defaultText});
    }

    render() {
        const props = this.props;
        const displayAddress = (props.trimAddress ? trimAddress(props.address) : props.address);
        const hasMetaMask = window.web3 && window.web3.currentProvider && window.web3.currentProvider.isMetaMask;
        const labelledAddress = <div className="align-center">{props.detail}{props.showAddressText ? " Address: " : ""}<br /> {this.state.tooltipText}</div>
        return <React.Fragment>
            <Tooltip title={props.detail ? labelledAddress : this.state.tooltipText} onVisibleChange={this.setDefaultText}>
                <span className="clickable" id="copy-address" data-clipboard-text={props.address}>
                    {props.children ? props.children : displayAddress}
                </span>
            </Tooltip>
            {props.showEthereumBtn && <LinkToEtherScan address={props.address} isToken={props.isToken} trimAddress={props.trimAddress} />}
            {props.showMetaMaskBtn && hasMetaMask && window.ethereum && 
                <AddTokenToMetaMask address={props.address} showMetaMaskText={props.showMetaMaskText} symbol={props.symbol} imageUrl={props.imageUrl} />
            }
        </React.Fragment>
    }
}

BlockchainAddressToolTip.propTypes = {
    address: PropTypes.string.isRequired,
    copyTextOverride: PropTypes.string,
    showAddressText: PropTypes.bool,
    showTitle: PropTypes.bool,
    isToken: PropTypes.bool,
    trimAddress: PropTypes.bool,
    linkTooltip: PropTypes.string,
    showMetaMaskBtn: PropTypes.bool,
    showEthereumBtn: PropTypes.bool
  };

  BlockchainAddressToolTip.defaultProps = {
    showTitle: true,
    showAddressText: true,
    isToken: true,
    trimAddress: false,
    showMetaMaskBtn: true,
    showEthereumBtn: true
};

export default BlockchainAddressToolTip;