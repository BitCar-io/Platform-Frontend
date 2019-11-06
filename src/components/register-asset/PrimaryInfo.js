import React from "react";
import { Row, Col, Card, Form, Select, Input, Radio, Button, Alert, InputNumber } from "antd";
import { approvedMakes } from '../../util/data/approvedMakes';
import * as _ from 'lodash';
import countries from '../../util/data/countries';

const Option = Select.Option;
const { TextArea } = Input;

class PrimaryInfo extends React.Component {

    getYears = () => {
        const currentYear = new Date().getFullYear();
        const range = currentYear - 1900;
        const yearsArray = [...Array(range)].map((x, i) => x = i+1901);
        return _.reverse(yearsArray);
    }
    years = this.getYears();

    getCountries = () => {
        let c = [<option key="selected" disabled value=""></option>];
        countries.map((x, i) => c.push(<option key={i} value={x.name} > {x.name}</option>));
        return c;
    }
    countriesList = this.getCountries();

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.saveAndContinue();
            }
        });
    }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <React.Fragment>
            <Row>
                <i className="pe-7s-note2 header-icon" />
                <div className="header-titles">
                    <h1>Primary Information {this.props.tokenId}</h1>
                    <h4 className="car-spec-sub">
                        All fields below are mandatory.
                    </h4>
                </div>
            </Row>
            <Card className="dash-stat-card asset-reg-card">
                <Alert style={{ marginTop: 12 }}  message={this.props.warning} type="warning" showIcon />
                {/* { this.props.draftFound && <Alert style={{ marginTop: 12 }}  message="An draft asset was recovered from memory" type="info" showIcon />} */}

                <br />
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="Make" name="make">
                        {getFieldDecorator('make', { initialValue: this.props.draftForm.make, rules: [{ required: true, message: 'Please input the correct car manufacturer.' }], })(
                            <Select onChange={(event) => this.props.handleFormChange(event, 'make')}>
                                { approvedMakes.map((make, index) => <Option key={index} value={make}>{make}</Option>) }
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="Model">
                        {getFieldDecorator('model', { initialValue: this.props.draftForm.model, rules: [{ required: true, message: 'Please input the correct car model.' }], })(
                            <Input htmltype="text" placeholder="Model..." id="model" maxLength={50} onChange={(event) => this.props.handleFormChange(event, 'model')} />
                        )}
                    </Form.Item>

                    <p>Date of Manufacture:</p>
                    <Row>
                        <Col span={14}>
                            <Form.Item label="Year" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                {getFieldDecorator('year', { initialValue: this.props.draftForm.year, rules: [{ required: true, message: 'Please input the car\'s year of manufacture.' }], })(
                                    <Select onChange={(event) => this.props.handleFormChange(event, 'year')}>
                                        {this.years.map((x, i) => <Option key={i} value={x}>{x}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="Month" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                {getFieldDecorator('month', {initialValue: this.props.draftForm.month, rules: [{ required: true, message: 'Please input the car\'s month of manufacture.' }], })(
                                    <Select onChange={(event) => this.props.handleFormChange(event, 'month')}>
                                        {[...Array(12)].map((x, i) => <Option key={i} value={i}>{i+1}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Price when new (USD)">
                        {getFieldDecorator('newPrice', {initialValue: this.props.draftForm.newPrice, rules: [{ required: true, message: 'Please input the car\'s price when new in USD.' }], })(
                            <InputNumber onChange={(event) => this.props.handleFormChange(event, 'newPrice')} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={1000}
                                max={999999999} />
                        )}
                    </Form.Item>

                    <Form.Item label="Current value (USD)">
                        {getFieldDecorator('currentValue', {initialValue: this.props.draftForm.currentValue, rules: [{ required: true, message: 'Please input the car\'s current value in USD.' }], })(
                            <InputNumber onChange={(event) => this.props.handleFormChange(event, 'currentValue')} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={1000}
                                max={999999999}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="Odometer Reading">
                            <Radio.Group defaultValue={'miles'} onChange={(event) => this.props.handleFormChange(event, 'odometerType')}>
                                <Radio value="miles">Miles</Radio>
                                <Radio value="kilometres">Kilometres</Radio>
                            </Radio.Group>
                        {getFieldDecorator('odometer', { initialValue: this.props.draftForm.odometer, rules: [{ required: true, message: 'Please input the car\'s current odometer reading.' }], })(
                            <InputNumber onChange={(event) => this.props.handleFormChange(event, 'odometer')} 
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                max={999999}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="Chassis Number">
                        {getFieldDecorator('chassisNumber', { initialValue: this.props.draftForm.chassisNumber, rules: [{ required: true, message: 'Please input the car\'s chassis number.' }], })(
                            <Input onChange={(event) => this.props.handleFormChange(event, 'chassisNumber')} htmltype="text" placeholder="Chassis Number..." minLength={5} maxLength={100} />
                        )}
                    </Form.Item>

                    <Form.Item label="Engine Number">
                        {getFieldDecorator('engineNumber', { initialValue: this.props.draftForm.engineNumber, rules: [{ required: true, message: 'Please input the car\'s engine number.' }], })(
                            <Input onChange={(event) => this.props.handleFormChange(event, 'engineNumber')} htmltype="text" placeholder="Engine Number..." minLength={5} maxLength={100} />
                        )}
                    </Form.Item>

                    <Form.Item label="Vehicle Identification Number (VIN)">
                        {getFieldDecorator('vehicleNumber', { initialValue: this.props.draftForm.vehicleNumber, rules: [{ required: true, message: 'Please input the car\'s vehicle indentification number.' }], })(
                            <Input onChange={(event) => this.props.handleFormChange(event, 'vehicleNumber')} htmltype="text" placeholder="Vehicle Identification Number..." minLength={5} maxLength={100} />
                        )}
                    </Form.Item>

                    <Form.Item label="Engine Cylinders">
                        {getFieldDecorator('engine', { initialValue: this.props.draftForm.engine, rules: [{ required: true, message: 'Please select the number of engine cylinders.' }], })(
                            <Select onChange={(event) => this.props.handleFormChange(event, 'engine')}>
                                <Option value="Electric">Electric</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="5">5</Option>
                                <Option value="6">6</Option>
                                <Option value="8">8</Option>
                                <Option value="10">10</Option>
                                <Option value="12">12</Option>
                                <Option value="16">16</Option>
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="Transmission Type">
                        {getFieldDecorator('trans', { initialValue: this.props.draftForm.trans, rules: [{ required: true, message: 'Please select a transmission type.' }], })(
                            <Select onChange={(event) => this.props.handleFormChange(event, 'trans')}>
                                <Option value="manual">Manual</Option>
                                <Option value="automatic">Automatic</Option>
                                <Option value="semi">Semi-automatic (Tiptronic, Touchshift, Geartronic, Sportronic)</Option>
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="Number of Previous Owners">
                        {getFieldDecorator('previousOwners', { initialValue: this.props.draftForm.previousOwners, rules: [{ required: true, message: 'Please input the number of previous owners.' }], })(
                            <Select onChange={(event) => this.props.handleFormChange(event, 'previousOwners')}>
                                <Option value="0">0</Option>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="More than 3">More than 3</Option>
                            </Select>
                        )}
                    </Form.Item>

                    <p>Car Storage Location:</p>
                    <Row>
                        <Col span={14}>
                            <Form.Item label="Country" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                {getFieldDecorator('storageCountry', { initialValue: this.props.draftForm.storageCountry || '', rules: [{ required: true, message: 'Please input the country where the car is stored.' }], })(
                                    <select className="ant-select" style={{ height: 32}} onChange={(event) => this.props.handleFormChange(event, 'storageCountry')}>
                                        {this.countriesList.map(option => option)}
                                    </select>
                                )}
                            </Form.Item>
                            <Form.Item label="State" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                {getFieldDecorator('storageRegion', {  initialValue: this.props.draftForm.storageRegion })(
                                    <Input onChange={(event) => this.props.handleFormChange(event, 'storageRegion')} type="text" placeholder="State/Region/Province..." maxLength={100} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Can the car be serviced locally?" colon={false}>
                        {getFieldDecorator('servicedLocally', { initialValue: this.props.draftForm.servicedLocally, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'servicedLocally')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Has the car been in an accident?" colon={false}>
                        {getFieldDecorator('accident', { initialValue: this.props.draftForm.accident, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'accident')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Have the tires been maintained?" colon={false}>
                        {getFieldDecorator('tiresMaintained', { initialValue: this.props.draftForm.tiresMaintained, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'tiresMaintained')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Car Description / History">
                        {getFieldDecorator('carDescription', { initialValue: this.props.draftForm.carDescription, rules: [{ required: true, message: 'Please input a description and the history of the car.' }], })(
                            <TextArea onChange={(event) => this.props.handleFormChange(event, 'carDescription')} autosize={{ minRows: 2, maxRows: 10 }} maxLength="5000"/>
                        )}
                    </Form.Item>

                    <br />

                    <Row>
                        <Col xs={{span:24, offset: 0}}>
                            <Button block size="large" htmlType="submit">Save and Continue</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </React.Fragment>
    );
  }
}
export default Form.create()(PrimaryInfo);