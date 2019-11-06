import React from 'react';
import { Form, Input, Col, DatePicker, Button, Alert } from 'antd';
import moment from 'moment';
import Axios from "axios";
import LoadingIndicator from '../LoadingIndicator';

class StepRedeemDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isPending: false
        }
    }

    getKYCFromRedeemDetails(orderID, documentID, dob) {
        return Axios.post(`${process.env.SIDS_API_URL}code/data`, {
            code: orderID,
            dob: dob,
            documentID: documentID
        });
    }

    next = () => {

        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            this.setState({isPending: true});

            const errorMessage = Error("The system could not validate the details you have entered, please check your information and try again, or contact us for assistance.");

            const redemptionCode = values.redemptionCode.trim();

            this.getKYCFromRedeemDetails(redemptionCode, values.inputIDDocumentNumber, values.inputDOB.format("YYYY-MM-DD"))
            .then((result) => {

                if(result.data.status != 200) {
                    return this.setState({error: errorMessage});
                }

                const redeemData = result.data.result;
                redeemData["code"] = redemptionCode;

                const errorSettingData = this.props.setRedeemData(redeemData);

                if(errorSettingData) {
                    console.error(errorSettingData)
                    return this.setState({error: errorMessage, isPending: false});
                }

                this.props.setCurrentStep(this.props.getCurrentStep() + 1);
            })
            .catch((error) => {
                console.error(error);
                this.setState({error: errorMessage, isPending: false});
            })
        });
    }

    prev = () => {
        this.props.setCurrentStep(this.props.getCurrentStep() - 1);
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        return (
            <Col>
                <Form.Item key='redemptionCode' label={'Enter your PayPal purchase redemption code (located on your BitCar receipt).'}>
                    {getFieldDecorator('redemptionCode', {rules: [{ required: true, message: "Please enter a valid redemption code" }], })(
                        <Input placeholder="eg: 8RU61172JS455403V" />
                    )}
                </Form.Item>
                <Form.Item key='inputIDDocumentNumber' label={'Enter the number from the ID Document used when the payment was made'}>
                    {getFieldDecorator('inputIDDocumentNumber', {rules: [{ required: true, message: "Please enter a valid Document ID number" }], })(
                        <Input placeholder="eg: N729182" />
                    )}
                </Form.Item>
                <Form.Item key={'inputDOB'} label="Enter your date of birth">
                    {getFieldDecorator('inputDOB', {rules: [{ required: true, message: "Please enter a valid date" }], })(
                        <DatePicker 
                            disabledDate={(current) => {return moment().year() - current.year() < 18 || current.year() < 1900}}
                            showToday={false}
                            defaultPickerValue={moment().subtract("18", "years")}
                        />
                    )}
                </Form.Item>

                {this.state.error && 
                    <Alert
                        message={"Verification Failed"}
                        description={this.state.error.message}
                        type={"warning"}
                        closable
                        onClose={this.state.error = null}
                    />
                }

                <div className="steps-action">
                    <Button className="step-next-btn" size={'large'} type="primary" onClick={this.next} disabled={this.state.isPending}>
                        {(this.state.isPending && <LoadingIndicator text="Verifying" />) || "Next"}
                    </Button>
                </div>
            </Col>
        );
    }
}

export default Form.create()(StepRedeemDetails);