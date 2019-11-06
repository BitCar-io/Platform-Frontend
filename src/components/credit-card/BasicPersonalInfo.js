import React from 'react';
import {Col, Form, Input, Row} from 'antd';
import countries from '../../util/data/countries';
import AddressFields from './AddressFields';
import PropTypes from 'prop-types';
import ReadOnlyFields from './ReadOnlyFields';

class BasicPersonalInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            monthDays: [],
            emailConfirmationIsDirty: false
        }
    }

    componentDidMount() {
        if(!this.props.mountForm) {
            return;
        }

        this.props.mountForm(this.props.form);
    }

    componentWillUnmount() {
        if(!this.props.unmountForm) {
            return;
        }

        this.props.unmountForm();
    }

    validateEmail = (rule, value, callback) => {

        if(!value || value.length === 0) {
            callback();
            return;
        }
    
        if(!/\S+@\S+\.\S+/.test(value)) {
            callback("Please enter a valid email address.");
            return;
        }
    
        if(countries.find(country => country.isBlacklisted && country.topLevelDomain.split(',').find(domain => value.endsWith(domain)))) {
            callback("This email domain is not supported for membership at BitCar.");
            return;
        }

        callback();
    }

    validateEmailConfirmation = (rule, value, callback) => {

        const { form } = this.props;

        if( value && this.props.enableEmailConfirmation && form.getFieldValue('email') !== value) {
            callback("Email addresses entered, must match.");
            return;
        }

        callback();
    }

    onEmailBlur = e => {

        if(!this.props.enableEmailConfirmation) {
            return;
        }
    
        const { form } = this.props;

        form.validateFields(['emailConfirmation'], {force: true});
    };

    onEmailConfirmationBlur = e => {
        const { value } = e.target;
        this.setState({ emailConfirmationIsDirty: this.state.emailConfirmationIsDirty || !!value });
    };
        
    render() {
        const props = this.props;
        const fields = this.props.fields;
        const {getFieldDecorator} = props.form;

        var opts = {};

        if(props.isReadOnly) {
            opts["readOnly"] = true,
            opts["className"] = "input-disabled"
        }

        const labels = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email'
        }

        const fieldItems = [
            <Form.Item key='firstName' label={'First Name'}>
                {getFieldDecorator('firstName', {initialValue: fields.firstName.value, rules: [{ required: true, message: 'Please enter your first name.' }], })(
                    <Input type="text" autoComplete="off" {...opts}/>
                )}
            </Form.Item>,
            <Form.Item key='lastName' label={'Last Name'}>
                {getFieldDecorator('lastName', {initialValue: fields.lastName.value, rules: [{ required: true, message: 'Please enter your last name.' }], })(
                    <Input type="text" autoComplete="off" {...opts}/>
                )}
            </Form.Item>,
            <Form.Item key='email' label={'Email'}>
                {getFieldDecorator('email', {initialValue: fields.email.value, rules: [{ required: true, message: 'Please enter your email address' }, {validator: this.validateEmail}], })(
                    <Input type="email" autoComplete="off" onBlur={this.onEmailBlur} maxLength={254} {...opts}/>
                )}
            </Form.Item>,
            props.enableEmailConfirmation && <Form.Item key='emailConfirmation' label={'Confirm Email'}>
                    {getFieldDecorator('emailConfirmation', {initialValue: fields.emailConfirmation.value, rules: [{ required: true, message: 'Please confirm your email address' }, {validator: this.validateEmailConfirmation}] })(
                        <Input type="email" autoComplete="off" onBlur={this.onEmailConfirmationBlur} maxLength={254} {...opts}/>
                    )}
            </Form.Item>
        ];

        const homeAddressField = <AddressFields form={props.form} line1={fields.line1.value} line2={fields.line2.value} city={fields.city.value} state={fields.state.value} postcode={fields.postcode.value} country={fields.country.value} isReadOnly={props.isReadOnly} />;

        return (
        <React.Fragment>
            <Row gutter={16}>
                {props.isReadOnly && <ReadOnlyFields fields={fieldItems} fieldValues={fields} />}
                {!props.isReadOnly && 
                    fieldItems.map((field, key) => 
                    <Col sm={24} md={12} lg={12} xl={12} key={key}>
                        {field}
                    </Col>)
                }

                {homeAddressField}
            </Row>
        </React.Fragment>
        );
    };
}

BasicPersonalInfo.propTypes = {
    fields: PropTypes.object.isRequired,
    mountForm: PropTypes.func,
    unmountForm: PropTypes.func,
    isReadOnly: PropTypes.bool,
    enableEmailConfirmation: PropTypes.bool
};

BasicPersonalInfo.defaultProps = {
    enableEmailConfirmation: false,
    isReadOnly: false
}

const formOptions = {
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {

        const fieldNames = Object.keys({...props.fields});

        let createdFormFields = {};
        
        fieldNames.forEach((fieldName, index) => {
            createdFormFields[fieldName] = Form.createFormField({
                ...props.fields[fieldName],
                value: props.fields[fieldName].value,
            })
        });

        return createdFormFields;
    }
};

export default Form.create(formOptions)(BasicPersonalInfo);
