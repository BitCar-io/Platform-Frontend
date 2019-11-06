import React from 'react';
import PropTypes from 'prop-types';
import regions from '../../util/data/countries';
import { Form, Select } from 'antd';
import countries from '../../util/data/countries';

export const getCountry = (alpha3Code) => {
    return countries.find(country => country.alpha3Code === alpha3Code);
}

export const getCountryRegion = (alpha3Code) => {
    const country = this.getCountry(alpha3Code);
    return country ? country.whitelistCode : null;
}

export const nationalityArrayToString = (nationalities) => {
    if(!nationalities || !nationalities.length) {
        return '';
    }

    let nationalitityList = [];
    for (let index = 0; index < nationalities.length; index++) {
        let code = nationalities[index];
        nationalitityList.push(getCountry(code).demonym);
    }

    return nationalitityList.toString();
}

class NationalitySelector extends React.Component { 

    validateBlacklist = (rule, value, callback) => {
        // if (value === undefined) {
        //     callback();
        //     return;
        // }

        // const country = getCountry(value);

        // // if validation fails
        // if (!country || country.isBlacklisted) {
        //     callback(`Nationality is not allowed.`);
        //     return;
        // }
        // validation succeeds
        callback();
    }

    render () {

        const props = this.props;
        const {getFieldDecorator} = props.form;
        // const validatorToUse = props.validateBlacklist ? this.validateBlacklist : props.validator;
        // const validator = validatorToUse ? {validator: validator} : undefined;

        var opts = {}
        if(props.isReadOnly) {
            opts["readOnly"] = true
            opts["className"] = "input-disabled"
        }

        return <Form.Item label={props.label}>
        {getFieldDecorator(props.id, {rules: [{ required: props.isRequired, message: props.requiredMessage}] }
        )(
            <Select showSearch
                mode="multiple"
                tokenSeparators={[',']}
                placeholder={props.placeholder}
                optionFilterProp="children"
                autoComplete="off"
                onChange={this.onNationalityChanged}
                {...opts}
            >
            { regions.filter(region => region.displayToUser).sort(region => region.sortOrder).map((region, i) => <Select.Option key={i} value={region.alpha3Code}>{region.demonym}</Select.Option>) }
            </Select>
        )}
    </Form.Item>
    };
};

NationalitySelector.propTypes = {
    form: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onNationalityChanged: PropTypes.func,
    placeholder: PropTypes.string,
    requiredMessage: PropTypes.string,
    validateBlacklist: PropTypes.bool,
    validator: PropTypes.func
  };

NationalitySelector.defaultProps = {
    isRequired: true,
    isReadOnly: false,
    label:'Nationalities',
    placeholder: 'Select your nationalities / citizenships',
    requiredMessage: 'Please enter your nationalities / citizenships',
    validateBlacklist: true
}

export default NationalitySelector;