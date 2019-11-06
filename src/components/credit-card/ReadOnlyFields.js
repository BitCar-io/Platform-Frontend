import { Form, Col } from "antd";
import React from "react";

const ReadOnlyFields = (props) => {

    const validFields = props.fields.filter(field => !(!field) && field.key !== null || field.key !== undefined);
    const overrideValues = props.overrideValues;

    // console.log('field values', validFields, props.fieldValues, overrideValues);

    return validFields.map((field, index) => 
    {
        const fieldValueObject = props.fieldValues[field.key];
        const fieldValueObjectValue = fieldValueObject && fieldValueObject.value;
        const fieldValue = fieldValueObjectValue !== undefined ? fieldValueObjectValue : fieldValueObject;

        // console.log('overrideValues', overrideValues);

        let fieldDisplayValue = "";
        if(overrideValues !== undefined && overrideValues[field.key] !== undefined) {
            fieldDisplayValue = overrideValues[field.key];
        } else if(fieldValue !== undefined) {
            fieldDisplayValue = fieldValue;
        }

        if(typeof fieldDisplayValue === 'object') {
            fieldDisplayValue = 'Error retrieving value = object';
        }

        // console.log(`key: ${field.key}`, `fieldValue: ${fieldValue}`, `fieldDisplayValue: ${fieldDisplayValue}`);

        // console.log('display type', typeof fieldDisplayValue);

        return <Col sm={24} md={12} lg={8} xl={8} key={field.key}>
        <Form.Item className="readonly-label" label={field.props.label}>
            <Form.Item className="readonly-value" label={fieldDisplayValue}>
            </Form.Item>
        </Form.Item>
            </Col>
    });
}

export default ReadOnlyFields;