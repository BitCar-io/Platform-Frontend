import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form, Select } from 'antd';

class SetBitCarPercent extends React.Component {

    state = {
        pending: false
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            console.log("Form values", values);

            const bitcarPercentage = Math.round(parseInt(values["bitcarPercentage"]));

            this.setState({pending: true});
            this.setBitCarPercentage(bitcarPercentage);
        });
    }

    setBitCarPercentage = async (bitcarPercentage) => {
        try {

            const asset = this.props.assetContract;
            const ethereumPercentage = 100 - bitcarPercentage;

            console.log("passed values", {bitcarPercentage: bitcarPercentage,ethereumPercentage: ethereumPercentage });

            console.log(`*** PAY STEP *** Setting purchase type percentages ETH:${ethereumPercentage}% BITCAR:${bitcarPercentage}%`);
            await asset.assetContract.methods.setPurchasePercentages(bitcarPercentage, ethereumPercentage).send({ from: this.props.currentUser.coinbase });

        } catch(error) {

            console.error("Error Output", error);
            // let buyResult = this.errorHandler(error.message);

            // this.setState({buyResult: buyResult });
        } finally {
            this.setState({pending: false});
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                // sm: { span: 16 },
                md: { span: 10 },
                xxl: {span: 10 }
            },
            wrapperCol: {
                xs: { span: 24 },
                // sm: { span: 8 },
                md: { span: 14 },
                xxl: { span: 14 }
            },
        };

        return <React.Fragment><Form onSubmit={this.handleSubmit}>
            <Row>
                <Col span={18}>
                    <Form.Item label="Bitcar / Ethereum split" {...formItemLayout}>
                        {getFieldDecorator('bitcarPercentage', {initialValue: this.props.defaultBitcarPercent })(
                            <Select>
                                {[...Array(101)].map((x, i) => <Select.Option key={i} value={i}>{i}% Bitcar / {100-i}% Ethereum</Select.Option>) }
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button size="large" type="primary" htmlType="submit" disabled={this.state.pending} loading={this.state.pending}>Set Bitcar / Ethereum Percentages</Button>
            </Form.Item>
        </Form></React.Fragment>
    }
}

SetBitCarPercent.propTypes = {
    assetContract: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

SetBitCarPercent.defaultProps = {
    defaultBitcarPercent: 20
};

export default Form.create()(SetBitCarPercent);