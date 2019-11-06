import React from 'react';
import { Row, Card, Col, Alert, Form, Input, Icon, Button } from 'antd';
import { ETHGATEWAY } from '../../util/globalVariables';

class Wallets extends React.Component {

    render() {
        const { getFieldDecorator, getFieldsError } = this.props.form;
        return <Col span={12} offset={6}>
            <Row>
            <Icon type="wallet" className="header-icon" />
            <div className="header-titles">
                <h1>Wallets</h1>
                <h4 className="car-spec-sub">
                Please enter your Ethereum wallet details.
                </h4>
            </div>
            </Row>
            <Card className="dash-stat-card">
                <Alert message={"In order to use the BitCar platform you will need a " + ETHGATEWAY + " wallet. Please install " + ETHGATEWAY + " and carefully follow the instructions to set up a new Ethereum wallet."} type="warning" showIcon />
                <br />
                <h4>You may also register a 'cold' wallet, which will allow you to view car assets in your portfolio without having your {ETHGATEWAY} account 
                    unlocked. Please note: adding additional wallets to your account after registration will attract a fee.</h4>
                <br />

                <Form onSubmit={() => this.props.handleContinue(this.props.form, '4')}>
                    <Form.Item label={'Primary ' + ETHGATEWAY +  ' wallet public address'}>
                        {getFieldDecorator('primaryWallet', {initialValue: this.props.wallets.primaryWallet, rules: [{ required: true, message: 'Please enter your primary ' + ETHGATEWAY + ' wallet.' }], })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={"Optional 'cold' wallet public address"}>
                        {getFieldDecorator('coldWallet', {initialValue: this.props.wallets.coldWallet })(
                            <Input />
                        )}
                    </Form.Item>

                    <br /><br />

                    <Button htmlType="submit" className="membership-continue" disabled={this.props.hasErrors(getFieldsError())} block>Continue</Button>
                </Form>
            </Card>
        </Col>
    }
}
export default Form.create()(Wallets);