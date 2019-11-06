import React from 'react';
import PropTypes from 'prop-types';
import CountrySelector, { getCountry } from '../membership/CountrySelector';
import { Form, Input, Col } from 'antd';
import ReadOnlyFields from './ReadOnlyFields';

const AddressFields = (props) => { 
    
    const {getFieldDecorator} = props.form;
    const line1 = props.line1;
    const line2 = props.line2;
    const city = props.city;
    const state = props.state;
    const postcode = props.postcode;
    const country = props.country;
    const isDisabled = props.isDisabled;
    const isRequired = !props.isReadOnly && !isDisabled && (props.isRequired === false ? props.isRequired : true);
    
    var opts = {};

    if(props.isReadOnly) {
        opts["readOnly"] = true
        opts["className"] = "input-disabled"
    }

    const fields = [<Form.Item key='line1' label={'Address line 1'}>
            {getFieldDecorator('line1', {initialValue: line1, rules: [{ required: isRequired, message: 'Please enter your street address.' }], })(
                <Input disabled={isDisabled} {...opts}/>
            )}
        </Form.Item>,
        <Form.Item key='line2' label={'Address line 2'}>
            {getFieldDecorator('line2', {initialValue: line2 })(
                <Input disabled={isDisabled} {...opts} placeholder="Address line 2 (optional)" />
            )}
        </Form.Item>,
        <Form.Item key='city' label={'City'}>
            {getFieldDecorator('city', {initialValue: city, rules: [{ required: isRequired, message: 'Please enter your city/town/suburb.' }], })(
                <Input disabled={isDisabled} {...opts}/>
            )}
        </Form.Item>,
        <Form.Item key='state' label={'State / County / Province'}>
            {getFieldDecorator('state', {initialValue: state, rules: [{ required: isRequired, message: 'Please enter your state, county or province.' }], })(
                <Input disabled={isDisabled} {...opts}/>
            )}
        </Form.Item>,
        <Form.Item key='postcode' label={'Post Code'}>
            {getFieldDecorator('postcode', {initialValue: postcode, rules: [{ required: isRequired, message: 'Please enter your Post code.' }], })(
                <Input disabled={isDisabled} {...opts}/>
            )}
        </Form.Item>,
        <CountrySelector key={'country'} isReadOnly={props.isReadOnly} isEnabled={props.isEnabled} isRequired={isRequired} label={props.countryLabel} placeholder={props.countryPlaceholder} requiredMessage={props.countryRequiredMessage} form={props.form} id='country' validateBlacklist={props.validateBlacklist} initialValue={country} />
    ];

    return <React.Fragment>
        {props.isReadOnly && <ReadOnlyFields fields={fields} fieldValues={props} overrideValues={{country: getCountry(country).name}} />}
        {
            !props.isReadOnly && fields.map((field, key) => 
            <Col sm={24} md={12} lg={12} xl={12} key={key}>
                {field}
            </Col>)
        }
    </React.Fragment>
};

AddressFields.propTypes = {
    form: PropTypes.object.isRequired,
    countryLabel: PropTypes.string,
    countryPlaceholder: PropTypes.string,
    countryRequiredMessage: PropTypes.string,
    isEnabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isRequired: PropTypes.bool,
    validateBlacklist: PropTypes.bool
};

AddressFields.defaultProps = {
    isEnabled: true,
    isReadOnly: false,
    isRequired: true,
    validateBlacklist: true
}

export default AddressFields;