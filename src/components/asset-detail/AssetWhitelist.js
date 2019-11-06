import React from "react";
import { connect } from 'react-redux';
import countries from '../../util/data/countries';

class AssetWhitelist extends React.Component {

    state = {
        whitelistData: undefined
    };

    componentDidMount() {
        this.loadWhitelistData(this.props.asset);
    }

    getYesNo = value => value ? "Yes" : "No";

    loadWhitelistData = async asset => {
        let whitelistData = [];

        whitelistData.push({item: 'Whitelist Restrictions Enabled?', value: this.getYesNo(asset.isWhitelistEnabled)});
        whitelistData.push({item: 'Initial Purchases Restricted?', value: this.getYesNo(asset.isWhitelistUsedForInitialPurchases)});
        whitelistData.push({item: 'Off Platform Transfers (Peer to Peer) Restricted?', value: this.getYesNo(asset.isWhitelistUsedForP2PTransfers)});
        whitelistData.push({item: 'Claimer Restricted?', value: this.getYesNo(asset.isWhitelistUsedForClaimerTransfers)});
        whitelistData.push({item: 'Countries Restricted:', value: this.getWhitelistCountries(asset.whitelistedCountries)});

        this.setState({whitelistData: whitelistData});
    }

    getWhitelistCountries = assetWhitelist => {

        if(!assetWhitelist || assetWhitelist.length === 0) {
            return '';
        }

        let whitelistCountries = [];

        for (let index = 0; index < assetWhitelist.length; index++) {
            let countryCode = assetWhitelist[index];
            
            let countryNames = countries.filter(country => {
                return country.whitelistCode === parseInt(countryCode)
            }).map(country => country.name);

            if(countryNames) {
                whitelistCountries.push(countryNames);
            } else {
                console.warn("Could not find any countries for asset whitelist, code:", countryCode);
            }
        }

        return whitelistCountries.sort().join(', ');
    }

    render() {
        const whitelistData = this.state.whitelistData;
        return (this.props.asset && this.props.currentUser && this.props.currentUser.isAdmin && whitelistData &&
                <React.Fragment>
                    <div className="card-heading">Whitelist Information (Admin View Only) {!this.props.asset.whitelistContract && "Not Setup Yet"}</div>
                    {this.props.asset.whitelistContract && <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-striped">
                                <tbody>
                                    {whitelistData.map((data, key) =>
                                    <tr key={key}>
                                        <td>{data.item}</td>
                                        <td>{data.value}</td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>}
                </React.Fragment>
        ) || <React.Fragment />
    }

}

const mapStateToProps = (state) => {
  return {
      currentUser: state.UIstate.currentUser
  }
}

export default connect(mapStateToProps)(AssetWhitelist);