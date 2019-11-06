import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Select } from 'antd';

const Option = Select.Option;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
let years = new Array();
for (let i = 18; i < 100; i++) {
    years[i] = currentYear - i;
}

class DobEntry extends React.Component {

    state = {
        monthDays: []
    }

    setMonthDays = (month) => {
        this.props.form.resetFields(['dobDay']);
        const year = this.props.form.getFieldValue('dobYear');
        // get correct number of days for given month
        const numberOfDays = new Date(year, month, 0).getDate();
        this.setState({ monthDays: new Array(numberOfDays).fill(undefined) });
    }

    render() { 
        const { getFieldDecorator } = this.props.form;
        return (
        <Form.Item label="Date of Birth" required style={{marginBottom: 0}}>
            <Col span={6} offset={2}>
                <Form.Item label="Year" colon={false} style={{lineHeight: 0}}>
                    {getFieldDecorator('dobYear', {initialValue: this.props.data.dobYear, rules: [{ required: true, message: 'Birth year is required.' }], })(
                        <Select onChange={() => this.props.form.resetFields(['dobMonth', 'dobDay'])}>
                            { years.map((year, index) => <Option key={index} value={year}>{year}</Option> )}
                        </Select>
                    )}
                </Form.Item>
            </Col>
            <Col span={6} offset={1}>
                <Form.Item label="Month" colon={false} style={{lineHeight: 0}}>
                    {getFieldDecorator('dobMonth', {initialValue: this.props.data.dobMonth, rules: [{ required: true, message: 'Birth month is required.' }], })(
                        <Select disabled={!this.props.form.getFieldValue('dobYear')} onChange={this.setMonthDays}>
                            { months.map((month, index) => <Option key={index} value={index + 1}>{month}</Option> )}
                        </Select>
                    )}
                </Form.Item>
            </Col>
            <Col span={6} offset={1}>
                <Form.Item label="Day" colon={false} style={{lineHeight: 0}}>
                    {getFieldDecorator('dobDay', {initialValue: this.props.data.dobDay, rules: [{ required: true, message: 'Birth day is required.' }], })(
                        <Select disabled={!this.props.form.getFieldValue('dobMonth') || !this.props.form.getFieldValue('dobYear')}>
                            { this.state.monthDays.map((day, index) => <Option key={index} value={index + 1}>{index + 1}</Option> )}
                        </Select>
                    )}
                </Form.Item>
            </Col>
        </Form.Item>
    );}
}

DobEntry.propTypes = {
    form: PropTypes.object.isRequired
  };

export default DobEntry;