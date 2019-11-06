import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Collapse, Form, Icon, Input, Row } from 'antd';
import * as _ from 'lodash';
import { RANK_LEVELS } from '../../core/rankTracking';
import {convertFromSolidityNumber, convertToSolidityNumber} from '../../util/helpers';
import {sendTransaction} from '../../util/web3/web3Wrapper';
import LoadingIndicator from "../LoadingIndicator";
import BigNumber from 'bignumber.js';

const FormItem = Form.Item;

class AssetLimitConfig extends React.Component {

    state = {
        pending: false
    };

    handleSaveClicked = async (event) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                console.log("SAVE ITEM", values["period"]);
            }
        });

        // WARNING - DO NOT COMMIT
        _.forEach(this.props.loadedAssets, async asset => {

            if(!asset.isLive) {
                return;
            }

            console.log("SET LIMIT for ", asset.tokenCode);

            const periodLimit = convertToSolidityNumber(new BigNumber(50000000)).toString();
            const userPeriodLimit = convertToSolidityNumber(new BigNumber(10000000)).toString();

            await sendTransaction(true, this.props.web3, asset.assetRankTracker.contract.methods.setRank(0, 86400, periodLimit, userPeriodLimit), {from: this.props.coinbase}).catch(error => console.error(error));
        });
        
    }

    onPanelChange = (assetAddress) => {
        console.log("PANEL CHANGE", assetAddress);
    }

    render() {
        return <React.Fragment>
            {this.props.currentUser && this.props.currentUser.isAdmin && this.props.loadedAssets && 
            <Row>
                <h1>Configure Purchase Limits</h1>
                <br />
                Select Car below to adjust limits.
                <Row>
                    <Form>
                        <Collapse accordion onChange={this.onPanelChange}>
                            {_.map(this.props.loadedAssets, (asset, key) =>
                                <Collapse.Panel key={key} header={`${asset.tokenCode} - ${asset.data.make} ${asset.data.model} ${asset.data.year}`}>
                                    {asset.assetRankTracker.assetLimits.map((assetLimit, key) =>
                                    assetLimit.rank >= 0 && assetLimit.rank < RANK_LEVELS.length && assetLimit.period > 0 &&
                                    <Row key={key} style={{marginBottom:"3px"}} gutter={16} >
                                        <Col span={3}>
                                            <FormItem name="address">
                                                {RANK_LEVELS[assetLimit.rank]}
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem name="period">
                                                <Input id="period" type="number" addonBefore="Period:" defaultValue={assetLimit.period} />
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem name="periodLimit">
                                                <Input id="periodLimit" type="number" addonBefore="Period Limit:" addonAfter="Tokens" defaultValue={assetLimit.periodLimit} />
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem name="periodUserLimit">
                                                <Input id="periodUserLimit" type="number" addonBefore="Period User Limit:" addonAfter="Tokens" defaultValue={assetLimit.periodUserLimit} />
                                            </FormItem>
                                        </Col>
                                        <Button id="saveLimit" size={'small'} style={{marginTop: 10, width: '5%'}} onClick={this.handleSaveClicked}>
                                            {!this.state.pending && <span>Save</span>}
                                            {this.state.pending && <LoadingIndicator text={' '} />}
                                        </Button>
                                    </Row>
                                    )}
                                </Collapse.Panel>
                            )}
                        </Collapse>
                    </Form>
                </Row>
            </Row>}
        </React.Fragment>
    }
}

const mapStateToProps = (state) => {
    return {
      allAssets: state.AssetState.allAssets,
      loadedAssets: state.AssetState.loadedAssets,
      unapprovedAssets: state.AssetState.unapprovedAssets,
      currentUser: state.UIstate.currentUser,
      coinbase: state.UIstate.coinbase,
      assetBalances: state.PlatformEvent.assetBalances,
      userAssets: state.UserState.portfolioAssets,
      platformTokenContract: state.UIstate.platformTokenContract,
      web3: state.UIstate.web3
    }
  }
  export default Form.create()(connect(mapStateToProps)(AssetLimitConfig));
