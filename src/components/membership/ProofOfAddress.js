import React from 'react';
import { Row, Col, Icon, Form, Input, Card, Button, Upload, Select } from 'antd';
import countries from '../../util/data/countries';
import proofOfAddressTypes from '../../util/data/proofOfAddressTypes';

const Option = Select.Option;

class ProofOfAddress extends React.Component {

    componentDidMount() {
        if (!this.props.country) {
            this.props.history.push('0');
        }
    }

    render(){
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const countryOfResidence = countries.find((country) => country.numericCode === this.props.country);

        return <Col span={8} offset={8}>
            <Row>
                <i className="pe-7s-home header-icon" />
                <div className="header-titles">
                    <h1>Address</h1>
                    <h4 className="car-spec-sub">
                    Please enter your address details.
                    </h4>
                </div>
            </Row>
            <Card className="dash-stat-card">
                <Form onSubmit={() => this.props.handleContinue(this.props.form, '3')}>
                    <Form.Item label={'Address'}>
                        {getFieldDecorator('address1', {initialValue: this.props.address.address1, rules: [{ required: true, message: 'Please enter your street address.' }], })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={'Address line 2'}>
                        {getFieldDecorator('address2', {initialValue: this.props.address.address2 })(
                            <Input placeholder="Address line 2 (optional)" />
                        )}
                    </Form.Item>
                    <Form.Item label={'City'}>
                        {getFieldDecorator('city', {initialValue: this.props.address.city, rules: [{ required: true, message: 'Please enter your city/town/suburb.' }], })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={'State / County / Province'}>
                        {getFieldDecorator('state', {initialValue: this.props.address.state, rules: [{ required: true, message: 'Please enter your state, county or province.' }], })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={'ZIP / Post Code'}>
                        {getFieldDecorator('zip', {initialValue: this.props.address.zip, rules: [{ required: true, message: 'Please enter your ZIP or Post code.' }], })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item>
                        { countryOfResidence && <Input value={countryOfResidence.name} disabled />}
                    </Form.Item>
                    <Form.Item label={'Proof of Address Document Type'}>
                        {getFieldDecorator('proofOfAddressDocType', {initialValue: this.props.address.proofOfAddressDocType, rules: [{ required: true, message: 'Please select the type of proof of address you will provide.' }], })(
                            <Select
                            showSearch
                            placeholder="Select Proof of Address Type"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                            {/* TODO: put a debounce on this */}
                            { proofOfAddressTypes.map((proofOfAddressType, i) => <Option key={i} value={proofOfAddressType.description}>{proofOfAddressType.description}</Option>) }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'Proof of Address Document'}>
                        {getFieldDecorator('proofOfAddressDoc', {initialValue: this.props.address.proofOfAddressDoc, rules: [{ required: false, message: 'Please upload a document as proof of address.' }], })(
                            <Upload >
                                <Button>
                                <Icon type="upload" /> Click to Upload
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>

                    <br /><br />

                    <Button htmlType="submit" className="membership-continue" disabled={this.props.hasErrors(getFieldsError())} block>Continue</Button>
                </Form>
            </Card>
        </Col>
    }
}
export default Form.create()(ProofOfAddress);