import React from 'react';
import { Form, Input } from 'antd';
import { contractAddressLength } from '../../util/helpers';

const WalletAddressInput = props => {

    return <Form.Item name="walletAddress" style={{marginBottom: 10}}>
        {props.getFieldDecorator('walletAddress', {initialValue: props.initialValue, rules: [{ required: props.isRequired, message: 'Please enter a PUBLIC wallet address...' }, {validator: props.validator}], })(
        <Input className="wallet-text-input" htmltype="text" placeholder={props.placeholder ? props.placeholder : "Enter a PUBLIC wallet address here..."} maxLength={contractAddressLength} autoComplete="off"
        addonAfter={props.addonAfter} />
        )}
    </Form.Item>
}
export default WalletAddressInput;

