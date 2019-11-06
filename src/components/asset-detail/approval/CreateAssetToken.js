import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form, Input, Select, Tooltip } from 'antd';
import { convertToSolidityNumber, secondsToYearsString } from '../../../util/helpers';
import { setCurrentAdminApprovalProgress } from '../../../util/assetHelpers';

class CreateAssetToken extends React.Component {

    state = {
        pending: false
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            console.log("Form values", values);
            
            if (err) {
                return;
            }

            const tokenCode = values["tokenCode"];
            const minOwnershipPercentage = Math.round(parseInt(values["minOwnership"]));
            const maximumCycles = Math.round(parseInt(values["extensions"])) * 2;

            this.setState({pending: true});
            this.createAssetToken(tokenCode, minOwnershipPercentage, maximumCycles);
        });
    }

    createAssetToken = async (tokenCode, minOwnershipPercentage, maximumCycles) => {
        try {

            const asset = this.props.assetContract;
            let totalTokenSupply = convertToSolidityNumber(asset.totalTokenSupply);
            const tradingTimeSeconds = asset.tradingPeriodDuration;
            const votingTimeSeconds = asset.votingPeriodDuration;

            console.log("passed values", {tokenCode: tokenCode,minOwnershipPercentage: minOwnershipPercentage,maximumCycles: maximumCycles, totalTokenSupply: totalTokenSupply, tradingTimeSeconds: tradingTimeSeconds, votingTimeSeconds:votingTimeSeconds });

            console.log("*** PAY STEP *** Creating Asset token");
            await asset.assetContract.methods.createAssetToken(tokenCode, tokenCode, totalTokenSupply, minOwnershipPercentage, tradingTimeSeconds, votingTimeSeconds, maximumCycles).send({from: this.props.currentUser.coinbase});

        } catch(error) {

            console.error("Error During Purchase Attempt", error);
            // let buyResult = this.errorHandler(error.message);

            // this.setState({buyResult: buyResult });
        } finally {
            this.setState({pending: false});
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                // sm: { span: 16 },
                md: { span: 10 },
                xxl: {span: 10 }
            },
            wrapperCol: {
                xs: { span: 24 },
                // sm: { span: 8 },
                md: { span: 14 },
                xxl: { span: 14 }
            },
        };

        const tradingPeriodString = secondsToYearsString(this.props.assetContract.tradingPeriodDuration);

        return <React.Fragment><Form onSubmit={this.handleSubmit}>
            <Row>
                <Col span={18}>
                    <Form.Item label="Token Code" {...formItemLayout}>
                        {getFieldDecorator('tokenCode', { rules: [{ required: true, message: 'Please input a valid token code!' }]})(
                            <Input htmltype="text" maxLength="9" placeholder="Token Code" />
                        )}
                    </Form.Item>
                        <Form.Item label="Trading Period" {...formItemLayout}>
                            {getFieldDecorator('tradingPeriod', {initialValue: tradingPeriodString, rules: [{ required: true, message: 'Error loading Trading Period!' }] })(
                                <Tooltip title="(set by Agent)" placement="right" >
                                    <Input htmltype="text" disabled value={tradingPeriodString} className="approval-agentdata-disabled" />
                                </Tooltip>
                            )}
                        </Form.Item>
                    <Form.Item label="Voting Period" {...formItemLayout}>
                        {getFieldDecorator('votingPeriod', {initialValue: this.props.defaultVotingPeriod, rules: [{ required: true, message: 'Please select a valid voting period' }] })(
                            <Select>
                                {[...Array(31)].map((x, i) => i > 2 && <Select.Option key={i} value={i}>{i} days</Select.Option>) }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Number of Extensions" {...formItemLayout}>
                        {getFieldDecorator('extensions', {initialValue: this.props.defaultNumberOfExtensions, rules: [{ required: true, message: 'Please select a valid number of extensions' }] })(
                            <Select>
                                {[...Array(3)].map((x, i) => <Select.Option key={i} value={i}>{i}</Select.Option>) }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Minimum Ownership %" {...formItemLayout}>
                        {getFieldDecorator('minOwnership', {initialValue: this.props.defaultMinOwnership, rules: [{ required: true, message: 'Please select a valid minimum ownership' }] })(
                            <Select>
                                {[...Array(11)].map((x, i) => <Select.Option key={i*5+50} value={i*5+50}>{i*5+50} %</Select.Option>) }
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button size="large" type="primary" htmlType="submit" disabled={this.state.pending} loading={this.state.pending}>Create car tokens</Button>
            </Form.Item>
        </Form></React.Fragment>
    }
}

CreateAssetToken.propTypes = {
    assetContract: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    defaultVotingPeriod: PropTypes.number
};

CreateAssetToken.defaultProps = {
    defaultVotingPeriod: 14,
    defaultMinOwnership: 70,
    defaultNumberOfExtensions: 1
};

export default Form.create()(CreateAssetToken);