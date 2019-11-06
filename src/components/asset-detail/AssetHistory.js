import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from "antd";

const AssetHistory = (props) => (
    <React.Fragment>
        <div className="card-heading">Transaction History</div>
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                <thead>
                    <tr>
                    <th>Value (USD)</th>
                    <th>When</th>
                    <th>Etherscan Link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>56.04</td>
                    <td>7 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                    <tr>
                    <td>58.54</td>
                    <td>1 day 17 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                    <tr>
                    <td>60.05</td>
                    <td>2 days 2 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                    <tr>
                    <td>57.03</td>
                    <td>3 days 17 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                    <tr>
                    <td>61.42</td>
                    <td>4 days 8 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                    <tr>
                    <td>59.07</td>
                    <td>5 days 17 hrs ago</td>
                    <td><Icon type="link" /> View on Etherscan</td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </React.Fragment>
);

AssetHistory.propTypes = {
    assetTokenAddress: PropTypes.string
  };

export default AssetHistory;