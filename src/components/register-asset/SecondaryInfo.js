import React from "react";
import { Row, Col, Card, Form, Icon, Radio, Button, Alert, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../util/helpers";

const { TextArea } = Input;

class SecondaryInfo extends React.Component {

    state = {
        qtyMadeKnownValidation: {
          validateStatus: '',
          errorMsg: ''
        }
    }

    componentDidMount() {
        scrollToTop(); // scroll to top of page on load
        // console.log(this.props.draftForm);
    }

    toggleQtyMadeUnknown = (event) => {
        this.props.handleFormChange(event, 'qtyMadeUnknown');
        let qtyMadeKnown = this.props.draftForm.qtyMadeUnknown;
        if (qtyMadeKnown === false) {
            setTimeout(() => this.props.handleFormChange(null, 'qtyMade'), 50);
        }
    }

    validateQtyMadeKnown = () => {
        if (!this.props.draftForm.qtyMade && !this.props.draftForm.qtyMadeUnknown) {
            this.setState({ qtyMadeKnownValidation: {
            validateStatus: 'error',
            errorMsg: "Enter the total number of cars if known. If not known, select 'Unknown'."
            }});
            return false;
        } else {
            this.setState({ qtyMadeKnownValidation: {
            validateStatus: '',
            errorMsg: ''
            }});
            return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.validateQtyMadeKnown()) {return};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.saveAndContinue();
            }
        });
    }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <React.Fragment>
            <Row>
                <i className="pe-7s-note2 header-icon" />
                <div className="header-titles">
                    <h1>Secondary Information {this.props.tokenId}</h1>
                    <h4 className="car-spec-sub">
                        Fields marked with * are mandatory.
                    </h4>
                </div>
            </Row>
            <Card className="dash-stat-card asset-reg-card">
                <Alert style={{ marginTop: 12 }}  
                    message={this.props.warning}
                    type="warning" 
                    showIcon />
                
                <br />

                <Form onSubmit={this.handleSubmit}>

                    <Form.Item label="Total number of cars made" validateStatus={this.state.qtyMadeKnownValidation.validateStatus} help={this.state.qtyMadeKnownValidation.errorMsg }>
                        {getFieldDecorator('qtyMade', { initialValue: this.props.draftForm.qtyMade })(
                            <Input type="number" onChange={(event) => this.props.handleFormChange(event, 'qtyMade')} disabled={this.props.draftForm.qtyMadeUnknown} />
                        )}
                        {getFieldDecorator('qtyMadeUnknown')(
                            <Checkbox checked={this.props.draftForm.qtyMadeUnknown} onChange={(event) => this.toggleQtyMadeUnknown(event)}>Unknown</Checkbox> 
                        )}
                    </Form.Item>

                    <Form.Item label="Is the car a limited edition version?" colon={false}>
                        {getFieldDecorator('ltd', { initialValue: this.props.draftForm.ltd, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'ltd')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Has the chassis or engine been signed by the individual who manufactured it?" colon={false}>
                        {getFieldDecorator('signed', { initialValue: this.props.draftForm.signed, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'signed')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}

                        { this.props.draftForm.signed === true &&
                            <Form.Item>
                                {getFieldDecorator('signedPerson', { initialValue: this.props.draftForm.signedPerson, rules: [{ required: true, message: 'Please input the name of the individual.' }], })(
                                    <Input type="text" placeholder="Name of individual..." maxLength="100"  onChange={(event) => this.props.handleFormChange(event, 'signedPerson')} /> 
                                )}
                            </Form.Item>
                        }
                    </Form.Item>

                    <Form.Item label="Does the car have a significant chassis number?" colon={false}>
                        {getFieldDecorator('significantChassis', { initialValue: this.props.draftForm.significantChassis, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'significantChassis')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Was the car driven or owned by a celebrity?" colon={false}>
                        {getFieldDecorator('celeb', { initialValue: this.props.draftForm.celeb, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'celeb')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                        { this.props.draftForm.celeb === true &&
                        <Form.Item>
                            {getFieldDecorator('celebName', { initialValue: this.props.draftForm.celebName, rules: [{ required: true, message: 'Please input the name of the celebrity.' }], })(
                                <Input type="text" placeholder="Name of celebrity..." maxLength="100" onChange={(event) => this.props.handleFormChange(event, 'celebName')} />
                            )}
                        </Form.Item>
                        }
                    </Form.Item>

                    <Form.Item label="Is the paint original?" colon={false}>
                        {getFieldDecorator('origPaint', { initialValue: this.props.draftForm.origPaint, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'origPaint')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Original accessories (jack, tools, etc)?" colon={false}>
                        {getFieldDecorator('origAccess', { initialValue: this.props.draftForm.origAccess, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'origAccess')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Has the car been transported overseas via air/ship?" colon={false}>
                        {getFieldDecorator('transportedOverseas', { initialValue: this.props.draftForm.transportedOverseas, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'transportedOverseas')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Has the car been transported locally via air/ship/train/truck?" colon={false}>
                        {getFieldDecorator('transportedLocally', { initialValue: this.props.draftForm.transportedLocally, rules: [{ required: true, message: 'Required field.' }], })(
                            <Radio.Group onChange={(event) => this.props.handleFormChange(event, 'transportedLocally')}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Factory fitted extras">
                        <TextArea value={this.props.draftForm.factoryExtras} autosize={{ minRows: 2, maxRows: 5 }} maxLength="5000" placeholder="Ceramic brakes etc..." onChange={(event) => this.props.handleFormChange(event, 'factoryExtras')} />
                    </Form.Item>

                    <Form.Item label="After market extras">
                        <TextArea value={this.props.draftForm.afterMarketExtras} autosize={{ minRows: 2, maxRows: 5 }} maxLength="5000"  placeholder="Custom wheels etc..." onChange={(event) => this.props.handleFormChange(event, 'afterMarketExtras')} />
                    </Form.Item>

                    <br />

                    <Row>
                        <Col span={2}>
                            <Link to={'1'}>
                                <Button className="btn" size="large">
                                    <Icon type="left" />
                                </Button>
                            </Link>
                        </Col>
                        <Col span={16} offset={4}>
                            <Button block size="large" htmlType="submit">Save and Continue</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </React.Fragment>
    );
  }
}
export default Form.create()(SecondaryInfo);
