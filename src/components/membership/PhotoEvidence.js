import React from 'react';
import { Row, Col, Icon, Form, Input, Card, Button, Upload, Select } from 'antd';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import {RANK_LEVELS, RANK_LEVELS_LOWERCASE} from '../../core/rankTracking';
import { URL_MEMBERSHIP_BASE } from '../../util/platformNavigation';

const Option = Select.Option;

class PhotoEvidence extends React.Component {

    state = {
        idLabel: ''
    }

    beforeUploadID = (file) => {
        // console.log(file)
        this.props.form.setFieldsValue({ id: file });
        // console.log('id: ...', this.props.form.getFieldValue('id').name)
        this.setState({ idLabel: this.props.form.getFieldValue('id').name });
        return false;
    }

    handlePhotoEvidenceContinue = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                let data = {
                    address: values.address,
                    addressLine2: values.addressLine2,
                    postCode: values.postCode,
                    city: values.city,
                    photoIdType: values.photoIdType,
                    id: values.id
                }
                this.props.setPhotoEvidence(data);
                if (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[1]) this.props.history.push(`${URL_MEMBERSHIP_BASE}${RANK_LEVELS_LOWERCASE[1]}/2`);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const idLabel = this.props.form.getFieldValue('id') && this.props.form.getFieldValue('id').name;
        return <Form onSubmit={this.handlePhotoEvidenceContinue}>

                    <Form.Item label={'Address'}>
                        {getFieldDecorator('address', {initialValue: this.props.photoEvidence.address, rules: [{ required: true, message: 'Please enter your address.' }], })(
                            <Input type="text" />
                        )}
                    </Form.Item>
                    <Form.Item label={'Address Line 2 (optional)'}>
                        {getFieldDecorator('addressLine2')(
                            <Input type="text" />
                        )}
                    </Form.Item>
                    <Form.Item label={'Post Code'}>
                        {getFieldDecorator('postCode', {initialValue: this.props.photoEvidence.postCode, rules: [{ required: true, message: 'Please enter your post code.' }], })(
                            <Input type="text" maxLength={6} />
                        )}
                    </Form.Item>
                    <Form.Item label={'City'}>
                        {getFieldDecorator('city', {initialValue: this.props.photoEvidence.city, rules: [{ required: true, message: 'Please enter your city.' }], })(
                            <Input type="text" />
                        )}
                    </Form.Item>
                    <Form.Item label={'Photo ID type'}>
                        {getFieldDecorator('photoIdType', {initialValue: this.props.photoEvidence.photoIdType, rules: [{ required: true, message: 'Please select your photo ID type.' }], })(
                            <Select>
                                <Option key="passport" value="passport">Passport</Option>
                                <Option key="identityCard" value="identityCard">Identity Card</Option>
                                <Option key="driversLicence" value="driversLicence">Drivers Licence</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'ID Document'}>
                        {getFieldDecorator('id', {initialValue: this.props.photoEvidence.id, rules: [{ required: true, message: 'Please upload your ID document.' }], })(
                            <Upload listType="picture" beforeUpload={this.beforeUploadID} accept=".jpg,.gif,.png">
                                <Button>
                                    <Icon type="upload" /> Select File
                                </Button>
                                <br />
                                <div style={{color: '#ddd'}}>
                                    { this.state.idLabel || this.props.photoEvidence.id && this.props.photoEvidence.id.name }
                                </div>
                            </Upload>
                        )}
                    </Form.Item>

                    <br />

                    <Row>
                        <Col span={2}>
                            { (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[1]) && 
                                this.props.currentUser && !this.props.currentUser.rank &&
                            <Link to={'0'}>
                                <Button className="btn" size="large">
                                    <Icon type="left" />
                                </Button>
                            </Link>
                            }
                        </Col>
                        <Col span={16} offset={4}>
                            <Button htmlType="submit" size="large" block>Continue</Button>
                        </Col>
                    </Row>

                </Form>
    }
}
const mapStateToProps = (state) => {
    return {
      currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(Form.create()(PhotoEvidence));