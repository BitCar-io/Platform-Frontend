import React from 'react';
import { Row, Col, Icon, Form, Card, Button, Upload } from 'antd';
import { RANK_LEVELS_LOWERCASE } from '../../core/rankTracking';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

class Selfie extends React.Component {

    beforeUploadPersonalPhoto = (file) => {
        // console.log(file)
        this.props.form.setFieldsValue({ personalPhoto: file });
        return false;
    }

    handleSelfieContinue = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                if (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[1]) {
                    this.props.setSelfie(values.personalPhoto);
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return <React.Fragment>
            <div style={{width: 400, margin: '0 auto'}}>
                <div style={{  background: '#ddd', border: '2px solid #eee', width: 400, height: 200, padding: 30 }}>
                    <Icon type="user" style={{ fontSize: 150 }} />
                    <Icon type="profile" style={{ fontSize: 150 }} />
                </div>
                <div className="align-center" style={{width: 400, padding: 20}}>
                    <p>Please take a photo of yourself holding a note that says 'BitCar' and today's date as above.</p>
                </div>
            </div>
                <br />
                <Form onSubmit={this.handleSelfieContinue}>
                    <Form.Item label={'Personal photo'}>
                        {getFieldDecorator('personalPhoto', {rules: [{ required: true, message: 'Please upload a personal photo of yourself.' }], })(
                            <Upload listType="picture" beforeUpload={this.beforeUploadPersonalPhoto} accept=".jpg,.gif,.png">
                                <Button>
                                    <Icon type="upload" /> Select File
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <br />

                    <Row>
                        <Col span={2}>
                            { (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[1]) && 
                                this.props.currentUser && !this.props.currentUser.rank &&
                            <Link to={'1'}>
                                <Button className="btn" size="large">
                                    <Icon type="left" />
                                </Button>
                            </Link>
                            }
                        </Col>
                        <Col span={16} offset={4}>
                            <Button size="large" htmlType="submit" block>Continue</Button>
                        </Col>
                    </Row>

                </Form>
        </React.Fragment>
    }
}
const mapStateToProps = (state) => {
    return {
      currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(Form.create()(Selfie));