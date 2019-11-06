import React from 'react';
import PropTypes from 'prop-types';
import regions from '../../util/data/countries';
import { Form, Select, Label } from 'antd';
import countries from '../../util/data/countries';

export const getCountry = (alpha3Code) => {
    return countries.find(country => country.alpha3Code === alpha3Code);
}

export const getCountryRegion = (alpha3Code) => {
    const country = this.getCountry(alpha3Code);
    return country ? country.whitelistCode : null;
}

class CountrySelector extends React.Component { 

    validateBlacklist = (rule, value, callback) => {
        if (value === undefined) {
            callback();
            return;
        }

        const country = getCountry(value);

        // if validation fails
        if (!country || country.isBlacklisted) {
            callback(`Country is not allowed.`);
            return;
        }
        // validation succeeds
        callback();
    }

    render () {

        const props = this.props;
        const {getFieldDecorator} = props.form;
        const validator = props.validateBlacklist ? this.validateBlacklist : props.validator;

        var opts = {}
        if(props.isReadOnly) {
            opts["readOnly"] = true
            opts["className"] = "input-disabled"
        }

        if(props.isReadOnly) {
            return <Form.Item label={props.label}>
            {getFieldDecorator(props.id, {initialValue: props.initialValue, rules: [{ required: props.isRequired && props.isEnabled, message: props.requiredMessage}, {validator: validator }] })(
                <Form.Item className="label-confirm" label={getCountry(props.initialValue).name}>
                </Form.Item>
            )}
        </Form.Item>    
        }

        return <Form.Item label={props.label}>
        {getFieldDecorator(props.id, {initialValue: props.initialValue, rules: [{ required: props.isRequired && props.isEnabled, message: props.requiredMessage}, {validator: validator }] })(
            <Select showSearch
                placeholder={props.placeholder}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                autoComplete="off"
                onSelect={this.onCountryChanged}
                disabled={!props.isEnabled}
            >
            { regions.filter(region => region.displayToUser).sort(region => region.sortOrder).map((region, i) => <Select.Option key={i} value={region.alpha3Code}>{region.name} {region.name === region.nativeName ? "" : `(${region.nativeName})`}</Select.Option>) }
            </Select>
        )}
    </Form.Item>
    };
};

CountrySelector.propTypes = {
    form: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    isEnabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isRequired: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onCountryChanged: PropTypes.func,
    placeholder: PropTypes.string,
    requiredMessage: PropTypes.string,
    validateBlacklist: PropTypes.bool,
    validator: PropTypes.func
  };

CountrySelector.defaultProps = {
    isEnabled: true,
    isRequired: true,
    isReadOnly: false,
    label:'Country of Residence',
    placeholder: 'Select country of residence',
    requiredMessage: 'Please enter your country of residence.',
    validateBlacklist: true
}

export default CountrySelector;