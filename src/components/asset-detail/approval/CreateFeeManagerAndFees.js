import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form, Input, Popover, Select, Tooltip } from 'antd';
import { convertFromSolidityAndFormatForDisplay } from '../../../util/helpers';
import { setCurrentAdminApprovalProgress } from '../../../util/assetHelpers';
import ApprovalStep from './ApprovalStep';
import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS_USD } from '../../../util/globalVariables';

class CreateFeeManagerAndFees extends React.Component {

    state;

    constructor(props) {
        super(props);

        this.state = {
            pending: false,
            beeDisplay: this.getFeeSummary(props.defaultBeeEscrowPercent),
            pafDisplay: this.getFeeSummary(props.defaultPafEscrowPercent),
            msiDisplay: this.getMSISummary(props.assetContract.totalMSI),
            msiTotal: convertFromSolidityAndFormatForDisplay(props.assetContract.totalMSI, 0)
        };
    }

    handleCreateFeeManagerClicked = async () => {
        // try {

        //     const asset = this.props.assetContract;

        //     console.log("passed values", {tokenCode: tokenCode,minOwnershipPercentage: minOwnershipPercentage,maximumCycles: maximumCycles, totalTokenSupply: totalTokenSupply, tradingTimeSeconds: tradingTimeSeconds, votingTimeSeconds:votingTimeSeconds });

        //     console.log("*** PAY STEP *** Creating Asset token");
        //     await asset.assetContract.methods.createAssetToken(tokenCode, tokenCode, totalTokenSupply, minOwnershipPercentage, tradingTimeSeconds, votingTimeSeconds, maximumCycles).send({from: this.props.currentUser.coinbase});

        // } catch(error) {

        //     console.error("Error Output", error);
        //     // let buyResult = this.errorHandler(error.message);

        //     // this.setState({buyResult: buyResult });
        // } finally {
        //     this.setState({pending: false});
        // }
    }

    handleCreateFeesClicked = async () => {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            console.log("Form values", values);

            const tokenCode = values["tokenCode"];
            const minOwnershipPercentage = Math.round(parseInt(values["minOwnership"]));
            const maximumCycles = Math.round(parseInt(values["extensions"])) * 2;

            this.setState({pending: true});
            this.createFeeManagerAndFees(tokenCode, minOwnershipPercentage, maximumCycles);
        });
    }

    getFeeSummary(value) {
        const percent = new BigNumber(value).dividedBy(100);
        const totalTokens = this.props.assetContract.totalTokenSupply.multipliedBy(percent);
        return `Amount per token (USD): ${percent.toFormat(DISPLAY_DECIMALS_USD)} | Amount for entire asset (USD): ${convertFromSolidityAndFormatForDisplay(totalTokens, 0)}`;
    }

    getMSISummary(totalMsi) {
        return convertFromSolidityAndFormatForDisplay(totalMsi, 2);
    }

    createFeeManagerAndFees = async (tokenCode, minOwnershipPercentage, maximumCycles) => {
        // try {

        //     const asset = this.props.assetContract;
        //     let escrow = Math.round(totalTokenSupply * (escrowPercent/100));

        //     let tradingPeriodYears = secondsToYears(asset.tradingPeriodDuration);

        //     let msi = Math.round(convertToSolidityNumber(msiPerYear * tradingPeriodYears));
        //     let paf = Math.round(totalTokenSupply * (pafPercent/100));

        //     console.log("Trading period in years", tradingPeriodYears);
        //     console.log("Escrow Total: $", convertFromSolidityAndFormatForDisplay(escrow, true, false));
        //     console.log("MSI Total: $", convertFromSolidityAndFormatForDisplay(msi, true, false));
        //     console.log("PAF Total: $", convertFromSolidityAndFormatForDisplay(paf, true, false));

        //     console.log("Escrow per token: $", convertFromSolidityAndFormatForDisplay(escrow / listPriceUSD, true, false));
        //     console.log("MSI per token: $", convertFromSolidityAndFormatForDisplay(msi / listPriceUSD, true, false));
        //     console.log("PAF per token: $", convertFromSolidityAndFormatForDisplay(paf / listPriceUSD, true, false));

        //     console.log("*** PAY STEP *** Creating Asset fees");
        //     await assetContract.methods.createAssetFees(escrow, msi, paf).send({from:adminUserAddress});

        // } catch(error) {

        //     console.error("Error Output", error);
        //     // let buyResult = this.errorHandler(error.message);

        //     // this.setState({buyResult: buyResult });
        // } finally {
        //     this.setState({pending: false});
        // }
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
                md: { span: 10 },
                xxl: { span: 10 }
            },
        };

        const assetContract = this.props.assetContract;
        const currentStep = assetContract.adminFeeManagerProgress + 1;

        return <React.Fragment><Form>
                <div className="sub-step-approval">
                    <ApprovalStep currentStep={currentStep}
                        stepNumber={1}
                        title="Step 1/2 - Create Fee Manager" 
                        description="Create the actual blockchain contract which will control the fees and escrow received for this car.">
                        <Form.Item>
                            <Button size="large" type="primary" onClick={this.handleCreateFeeManagerClicked} disabled={this.state.pending} loading={this.state.pending}>Create Fee Manager</Button>
                        </Form.Item>
                    </ApprovalStep>
                    <ApprovalStep currentStep={currentStep}
                        stepNumber={2}
                        title="Step 2/2 - Set Fee Values" 
                        description="Create all of the fee contracts with their required values."
                        isLastStep={true}>
                        <Form.Item label="Bitcar Extension Escrow (BEE) rate" {...formItemLayout}>
                            {getFieldDecorator('BEE', {rules: [{ required: true, message: 'Please select a valid value.' }] })(
                                <Popover content={this.state.beeDisplay} placement="bottom" >
                                    <Select onChange={(value) => this.setState({ beeDisplay: this.getFeeSummary(value) })} defaultValue={this.props.defaultBeeEscrowPercent}>
                                        {[...Array(16)].map((x, i) => <Select.Option key={i} value={i}>{i}%</Select.Option>) }
                                    </Select>
                                </Popover>
                            )}
                        </Form.Item>
                        <Form.Item label="Bitcar Platform Fee (PAF) rate" {...formItemLayout}>
                            {getFieldDecorator('PAF', {rules: [{ required: true, message: 'Please select a valid value.' }] })(
                                <Popover content={this.state.pafDisplay} placement="bottom" >
                                    <Select onChange={(value) => this.setState({ pafDisplay: this.getFeeSummary(value) })} defaultValue={this.props.defaultPafEscrowPercent}>
                                        {[...Array(16)].map((x, i) => <Select.Option key={i} value={i}>{i}%</Select.Option>) }
                                    </Select>
                                </Popover>
                            )}
                        </Form.Item>
                        <Form.Item label="MSI for 5 years" {...formItemLayout}>
                            {getFieldDecorator('MSI', {rules: [{ required: true, message: 'Error loading MSI!' }] })(
                                <Popover title="Set by Agent" content={this.state.msiDisplay} placement="right" >
                                    <Input htmltype="text" disabled value={this.state.msiTotal} className="approval-agentdata-disabled" />
                                </Popover>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button size="large" type="primary" onClick={this.handleCreateFeesClicked} disabled={this.state.pending} loading={this.state.pending}>Set Fee Values</Button>
                        </Form.Item>
                    </ApprovalStep>
                </div>
        </Form></React.Fragment>
    }
}

CreateFeeManagerAndFees.propTypes = {
    assetContract: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

CreateFeeManagerAndFees.defaultProps = {
    defaultBeeEscrowPercent: 8,
    defaultPafEscrowPercent: 0
};

export default Form.create()(CreateFeeManagerAndFees);