import React from 'react';
import { Card, Icon, Row } from "antd";
import LoadingIndicator from '../LoadingIndicator';
import { connect } from 'react-redux';
import PortfolioCard from './PortfolioCard';
import * as _ from 'lodash';
import { Link } from "react-router-dom";
import WalletAddressInputDisplay from '../address-book/WalletAddressInputDisplay';
import ChangeRequestList from '../change-request/ChangeRequestList';
import { loadPortfolioForUser } from '../../core/user';
import { URL_ALL_ASSETS } from '../../util/platformNavigation';

class PortfolioContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isPortfolioLoading: false,
            walletTextEntry: false
        };
    }

    componentDidMount() {
        loadPortfolioForUser(this.props.loadedAssets, this.props.currentUser);
    }

    componentDidUpdate(prevprops) {

        if(prevprops.currentUser !== this.props.currentUser) {
            loadPortfolioForUser(this.props.loadedAssets, this.props.currentUser);
            // console.log('loadPortfolioForUser');
            this.setState({walletTextEntry: false});
        }
    }

    onTextWallet = (wallet) => {
        this.setState({walletTextEntry: true});
        // console.log('walletTextEntry', this.state.walletTextEntry);
    }

    render() {
        const portfolioAssetCount = this.props.loadedAssets && this.props.portfolioLoaded ? _.size(this.props.portfolioAssets) : 0;
        const isUserUnlocked = this.props.coinbase !== undefined;

        const portfolioCards = this.props.loadedAssets && 
        <React.Fragment>
            {((!this.props.web3 || !this.props.portfolioLoaded) && <LoadingIndicator text="Loading Portfolio for selected wallet, Please Wait..." />) || 
            (portfolioAssetCount === 0 &&
                <Row className="portfolio-wallet-input-info">
                    <Icon type="exclamation-circle" className="font-24" style={{marginRight: 10}} />
                    <React.Fragment>
                        <span>You currently have {isUserUnlocked ? "no Car fractions in your account wallet(s)" : "no wallet unlocked."}</span>
                        <p style={{marginTop: "10px"}}>To view cars held in a BitCar user account, please do one of the following:-</p>
                        <ul>
                            <li>Enter a wallet address in the box provided above</li>
                            {!isUserUnlocked && <li>Unlock a wallet using the button at the top of the screen</li>}
                            {isUserUnlocked && <li>Unlock a different wallet</li>}
                        </ul>
                    </React.Fragment>
                </Row>)
            ||
            this.props.portfolioAssets && _.map(this.props.portfolioAssets, (asset, i) => <PortfolioCard key={i} asset={asset} isTickerOnline={this.props.isTickerOnline} bitcarUsd={this.props.bitcarUsd}></PortfolioCard>)
            }
        </React.Fragment>;

        return <React.Fragment>
            <Row className="portfolio-wallet-input" style={{ marginTop: 10, marginBottom: 10 }}>
                {(this.state.walletTextEntry || (this.props.portfolioLoaded && portfolioAssetCount === 0)) && <WalletAddressInputDisplay onWalletChanged={this.onTextWallet} />}
            </Row>

            <Card className="dash-stat-card asset-ownership-container">
                <Row>
                    { (this.props.portfolioLoaded && portfolioCards) || <LoadingIndicator text="Opening the garage doors, Please Wait..." /> }
                </Row>
            </Card>
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
        coinbase: state.UIstate.coinbase,
        loadedAssets: state.AssetState.loadedAssets,
        portfolioAssets: state.UserState.portfolioAssets,
        portfolioLoaded: state.UserState.portfolioLoaded,
        localUserWallets: state.UIstate.localUserWallets,
        bitcarUsd: state.PlatformEvent.bitcarUsd,
        isTickerOnline: state.PlatformEvent.isTickerOnline,
        currentUser: state.UIstate.currentUser,
        web3: state.UIstate.web3
    }
  }
export default connect(mapStateToProps)(PortfolioContainer);
