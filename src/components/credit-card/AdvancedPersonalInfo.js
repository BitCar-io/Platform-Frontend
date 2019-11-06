import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Checkbox, Select, Col, Row, DatePicker} from 'antd';
import CountrySelector, { getCountry } from '../membership/CountrySelector';
import AddressFields from './AddressFields';
import NationalitySelector, { nationalityArrayToString } from './NationalitySelector';
import moment from 'moment';
import ReadOnlyFields from './ReadOnlyFields';

class AdvancedPersonalInfo extends React.Component {

    constructor(props) {
        super(props);
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
        
    render() {
        function disabledDate(current) {
            return moment().year() - current.year() < 18 || current.year() < 1900;
        }

        const props = this.props;
        const fields = this.props.fields;
        const {getFieldDecorator} = props.form;

        var opts = {};

        if(props.isReadOnly) {
            opts["readOnly"] = true
            opts["className"] = "input-disabled"
        }

        const taxAddressFields = <AddressFields form={props.form} line1={fields.line1.value} line2={fields.line2.value} city={fields.city.value} state={fields.state.value} postcode={fields.postcode.value} country={fields.country.value} isReadOnly={props.isReadOnly} countryLabel={"Country"} countryPlaceholder={'Select country'} countryRequiredMessage={'Please select a country'} />;

        const fieldItems = [
            <Form.Item key={'dateOfBirth'} label="Date of birth">
                {getFieldDecorator('dateOfBirth', {initialValue: fields.dateOfBirth.value, rules: [{ required: true, message: "Please enter a valid date" }], })(
                    <DatePicker 
                        disabledDate={disabledDate}
                        showToday={false}
                        defaultPickerValue={moment().subtract("18", "years")}
                        {...opts}
                    />
                )}
            </Form.Item>,
            <CountrySelector key={'placeOfBirth'} isReadOnly={props.isReadOnly} initialValue={fields.placeOfBirth.value} label="Place of Birth" placeholder="Select place of birth" requiredMessage="Please enter your country of birth" validateBlacklist={false} form={props.form} id='placeOfBirth' />,
            <NationalitySelector key={'nationalities'} isReadOnly={props.isReadOnly} initialValue={fields.nationalities.value} id="nationalities" form={props.form} validateBlacklist={false} />,
            <Form.Item key={'idType'} label={'ID Document Type'}>
                {getFieldDecorator('idType', {initialValue: fields.idType.value, rules: [{ required: true, message: "Please enter the document type being provided" }], })(
                    <Select
                        placeholder="Select an identity document"
                        autoComplete="off"
                        {...opts}
                    >
                        <Select.Option value='Citizenship/Country ID Card'>Citizenship/Country ID Card</Select.Option>
                        <Select.Option value='Driving Licence'>Driving Licence</Select.Option>
                        <Select.Option value='Passport'>Passport</Select.Option>
                    </Select>
                )}
            </Form.Item>,
            <Form.Item key={'idNumber'} label={'ID Document Number'}>
                {getFieldDecorator('idNumber', {initialValue: fields.idNumber.value, rules: [{ required: true, message: "Please enter document number" }], })(
                    <Input {...opts} type="text" autoComplete="off" />
                )}
            </Form.Item>,
            <CountrySelector key={'idCountry'} isReadOnly={props.isReadOnly} id="idCountry" form={props.form} initialValue={fields.idCountry.value} label="Issuing Country" validateBlacklist={false} />,
            <Form.Item key={'occupation'} label={'Occupation'}>
                {getFieldDecorator('occupation', {initialValue: fields.occupation.value, rules: [{ required: true, message: "Please state your occupation (or 'none')." }], })(
                    <Input {...opts} type="text" autoComplete="off" />
                )}
            </Form.Item>,
            <Form.Item key={'employer'} label={'Employer'}>
                {getFieldDecorator('employer', {initialValue: fields.employer.value, rules: [{ required: true, message: "Please enter the name of your current employer, or 'none'." }], })(
                    <Input {...opts} type="text" autoComplete="off" />
                )}
            </Form.Item>,
            <Form.Item key={'isTaxAddressSameAsHome'} label={'Tax Address'}>
                {getFieldDecorator('isTaxAddressSameAsHome')(
                    <Checkbox {...opts} defaultChecked={fields.isTaxAddressSameAsHome.value}>Same as Home Address</Checkbox>
                )}
            </Form.Item>
        ];

        return (
        <React.Fragment>
            <Row gutter={16}>
                {props.isReadOnly && <ReadOnlyFields fields={fieldItems} fieldValues={fields}
                    overrideValues={
                        {
                            nationalities: nationalityArrayToString(fields.nationalities.value),
                            dateOfBirth: fields.dateOfBirth.value.format("YYYY-MM-DD"),
                            placeOfBirth: getCountry(fields.placeOfBirth.value).name,
                            idCountry: getCountry(fields.idCountry.value).name,
                            isTaxAddressSameAsHome: fields.isTaxAddressSameAsHome.value ? "Same as Home Address" : "Different to Home Address"
                        }
                    } 
                    />}
                {!props.isReadOnly && 
                    fieldItems.map((field, key) => 
                    <Col sm={24} md={12} lg={12} xl={12} key={key}>
                        {field}
                    </Col>)
                }
            </Row>

            {!fields.isTaxAddressSameAsHome.value &&
                <Row gutter={16}>
                    {taxAddressFields}
                </Row>
            }
        </React.Fragment>
        );
    };
}

AdvancedPersonalInfo.propTypes = {
    fields: PropTypes.object.isRequired,
    isReadOnly: PropTypes.bool,
    mountForm: PropTypes.func,
    unmountForm: PropTypes.func
};

AdvancedPersonalInfo.defaultProps = {
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

        // console.log('fields on AdvancedPersonalInfo', fieldNames, createdFormFields);

        return createdFormFields;
    }
};

export default Form.create(formOptions)(AdvancedPersonalInfo);