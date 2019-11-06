import React from 'react';
import { Col, Row, Card, Form, Button, Upload, Icon, Alert } from 'antd';
import { Link } from 'react-router-dom';
import {ipfsApiConnection} from '../../util/helpers';
import UploadedImage from './uploadedImage';
import PendingImage from './pendingImage';
import UploadedFile from './uploadedFile';

class SupportingDocs extends React.Component {

    vinImageError = 'Please upload a picture of the VIN.';
    serviceHistoryError = 'Please upload a PDF of the full service history.';
    insuranceDocument = 'Please upload a PDF of the current insurance document.';
    provenanceReportError = 'Please upload a PDF of the original sales invoice.';
    certificateAuthenticityError = 'Please upload a PDF of the certificate of authenticity.';
    mechanicReportError = 'Please upload a PDF of a current mechanic\'s report on the condition of the car.';

    state = {
        pending_vinImage: null,
        vinImage: {
          validateStatus: '',
          errorMsg: ''
        },
        pending_serviceHistory: null,
        serviceHistory: {
            validateStatus: '',
            errorMsg: ''
        },
        pending_insuranceDocument: null,
        insuranceDocument: {
            validateStatus: '',
            errorMsg: ''
        },
        pending_provenanceReport: null,
        provenanceReport: {
            validateStatus: '',
            errorMsg: ''
        },
        pending_certificateAuthenticity: null,
        certificateAuthenticity: {
            validateStatus: '',
            errorMsg: ''
        },
        pending_mechanicReport: null,
        mechanicReport: {
            validateStatus: '',
            errorMsg: ''
        },
        pending_otherSupportingDocs: null,
        otherSupportingDocs: {
            validateStatus: '',
            errorMsg: ''
        },
        uploading: false
    };

    componentDidMount() {
        console.log('didMount', this.props.draftForm);
    }

    beforeUploadFile = (file, field) => {
        console.log('running beforeUploadFile', file, field);
        this.setState({uploading: true});
        this.removeFile(field);
        let reader = new window.FileReader();
        reader.onload = () => {
            file.status = 'pending';
            this.setState({['pending_' + field]: file});
        }
        reader.onloadend = () => {
        // read as buffer and upload to IPFS
        const buffer = Buffer.from(reader.result);
        ipfsApiConnection.add(buffer, (err, ipfsHash) => {
            if (err) {
            file.status = 'error';
            this.setState({uploading: false, ['pending_' + field]: file});
            }
            if (ipfsHash) {
            this.setState({uploading: false, ['pending_' + field]: null});
            this.props.handleFormChange(ipfsHash[0].hash, field);
            }
        });
        }
        reader.readAsArrayBuffer(file);
        return false;
    }

    beforeUploadVinImage = (file) => {
        this.beforeUploadFile(file, 'vinImage');
        return false;
    }
    beforeUploadServiceHistory = (file) => {
        this.beforeUploadFile(file, 'serviceHistory');
        return false;
    }
    beforeUploadInsuranceDocument = (file) => {
        this.beforeUploadFile(file, 'insuranceDocument');
        return false;
    }
    beforeUploadprovenanceReport = (file) => {
        this.beforeUploadFile(file, 'provenanceReport');
        return false;
    }
    beforeUploadCertificateAuthenticity = (file) => {
        this.beforeUploadFile(file, 'certificateAuthenticity');
        return false;
    }
    beforeUploadMechanicReport = (file) => {
        this.beforeUploadFile(file, 'mechanicReport');
        return false;
    }
    beforeUploadOtherSupportingDocs = (file) => {
        this.beforeUploadFile(file, 'otherSupportingDocs');
        return false;
    }

    removeFile = (field) => {
        this.props.handleFormChange(null, field);
    }

    validateFile = (field, errorMessage) => {
        if (!this.props.draftForm[field]) {
          this.setState({ [field]: {
            validateStatus: 'error',
            errorMsg: errorMessage
          }});
          return false;
        } else {
          this.setState({ [field]: {
            validateStatus: '',
            errorMsg: ''
          }});
          return true;
        }
      }
    
    async pushDataToIPFS(dataFile) {
        console.log('pushing file to ipfs', dataFile);
        const content = ipfsApiConnection.types.Buffer.from(JSON.stringify(dataFile));
        const hash = await ipfsApiConnection.add(content);
        return hash;
    }
    
    handleSubmit = async (event) => {
        console.log('submitting');
        event.preventDefault();
        this.setState({uploading: true});
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            // validate images manually
            const vinImage = this.validateFile('supportingDocuments-vinImage', this.vinImageError);
            const serviceHistory = this.validateFile('supportingDocuments-serviceHistory', this.serviceHistoryError);
            const insuranceDocument = this.validateFile('supportingDocuments-insuranceDocument', this.insuranceDocumentError);
            const provenanceReport = this.validateFile('supportingDocuments-provenanceReport', this.provenanceReportError);
            const certificateAuthenticity = this.validateFile('supportingDocuments-certificateAuthenticity', this.certificateAuthenticityError);
            const mechanicReport = this.validateFile('supportingDocuments-mechanicReport', this.mechanicReportError);
            if (!err && vinImage && serviceHistory && insuranceDocument && provenanceReport && certificateAuthenticity && mechanicReport) {
                // save and continue to next page
                this.setState({uploading: false});
                this.props.saveAndContinue();
            } else {
                this.setState({uploading: false});
            }
        });
    }

    render() {
        const { uploading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const pdfHint = 'Please combine multiple files into one PDF before submitting under the relevant section.';
        return (
            <React.Fragment>
                <Row>
                    <i className="pe-7s-paperclip header-icon" />
                    <div className="header-titles">
                    <h1>Supporting Documentation {this.props.tokenId}</h1>
                    <h4 className="car-spec-sub">
                        Please upload PDF documents only.
                    </h4>
                    </div>
                </Row>
                <Card className="dash-stat-card">

                    <Alert style={{ marginTop: 12 }}  
                        message={this.props.warning}
                        type="warning" 
                        showIcon />
                    <Alert  style={{ marginTop: 5 }}
                        message={pdfHint}
                        type="info" 
                        showIcon />

                    <br />

                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="Photo of VIN" validateStatus={this.state.vinImage.validateStatus} help={this.state.vinImage.errorMsg}>
                            {getFieldDecorator('supportingDocuments-vinImage', { initialValue: this.props.draftForm.supportingDocuments.vinImage, rules: [{ required: true, message: this.vinImageError }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadVinImage} accept=".jpg">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_vinImage && <PendingImage file={this.state.pending_vinImage} /> }
                        { this.props.draftForm.vinImage &&  
                        <UploadedImage hash={this.props.draftForm.vinImage} removeImage={() => this.removeFile('vinImage')} label={ "Vin image" } />
                        }

                        <Form.Item label="Service History Records" validateStatus={this.state.serviceHistory.validateStatus} help={this.state.serviceHistory.errorMsg}>
                            {getFieldDecorator('supportingDocuments-serviceHistory', { initialValue: this.props.draftForm.supportingDocuments.serviceHistory, rules: [{ required: true, message: this.serviceHistoryError }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadServiceHistory} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_serviceHistory && <UploadedFile title={'Service History'} loading={true} /> }
                        { this.props.draftForm.serviceHistory && <UploadedFile title={'Service History'} loading={false} removeFile={() => this.removeFile('serviceHistory')} />}
                        
                        <Form.Item label="Current Insurance Document" validateStatus={this.state.insuranceDocument.validateStatus} help={this.state.insuranceDocument.errorMsg}>
                            {getFieldDecorator('supportingDocuments-insuranceDocument', { initialValue: this.props.draftForm.supportingDocuments.insuranceDocument, rules: [{ required: true, message: this.insuranceDocument }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadInsuranceDocument} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_insuranceDocument && <UploadedFile title={'Insurance Document'} loading={true} /> }
                        { this.props.draftForm.insuranceDocument && <UploadedFile title={'Insurance Document'} loading={false} removeFile={() => this.removeFile('insuranceDocument')} />}
                        
                        <Form.Item label="Original Sales Invoice" validateStatus={this.state.provenanceReport.validateStatus} help={this.state.provenanceReport.errorMsg}>
                            {getFieldDecorator('supportingDocuments-provenanceReport', { initialValue: this.props.draftForm.supportingDocuments.provenanceReport, rules: [{ required: true, message: this.provenanceReportError }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadprovenanceReport} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_provenanceReport && <UploadedFile title={'Sales Invoice'} loading={true} /> }
                        { this.props.draftForm.provenanceReport && <UploadedFile title={'Sales Invoice'} loading={false} removeFile={() => this.removeFile('provenanceReport')} />}

                        <Form.Item label="Certificate of Authenticity" validateStatus={this.state.certificateAuthenticity.validateStatus} help={this.state.certificateAuthenticity.errorMsg}>
                            {getFieldDecorator('supportingDocuments-certificateAuthenticity', { initialValue: this.props.draftForm.supportingDocuments.certificateAuthenticity, rules: [{ required: true, message: this.certificateAuthenticityError }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadCertificateAuthenticity} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_certificateAuthenticity && <UploadedFile title={'Certificate of Authenticity'} loading={true} /> }
                        { this.props.draftForm.certificateAuthenticity && <UploadedFile title={'Certificate of Authenticity'} loading={false} removeFile={() => this.removeFile('certificateAuthenticity')} />}


                        <Form.Item label="Mechanic's Report" validateStatus={this.state.mechanicReport.validateStatus} help={this.state.mechanicReport.errorMsg}>
                            {getFieldDecorator('supportingDocuments-mechanicReport', { initialValue: this.props.draftForm.supportingDocuments.certificateAuthenticity, rules: [{ required: true, message: this.mechanicReportError }], })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadMechanicReport} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_mechanicReport && <UploadedFile title={'Mechanic Report'} loading={true} /> }
                        { this.props.draftForm.mechanicReport && <UploadedFile title={'Mechanic Report'} loading={false} removeFile={() => this.removeFile('mechanicReport')} />}

                        <Form.Item label="Other Supporting Documents">
                            {getFieldDecorator('supportingDocuments-otherSupportingDocs', { initialValue: this.props.draftForm.supportingDocuments.otherSupportingDocs, })(
                                <Upload listType="picture" beforeUpload={this.beforeUploadOtherSupportingDocs} accept=".pdf">
                                    <Button disabled={uploading}><Icon type="upload" /> Select File</Button>
                                </Upload>
                            )}
                        </Form.Item>
                        { this.state.pending_otherSupportingDocs && <UploadedFile title={'Other Supporting Documents'} loading={true} /> }
                        { this.props.draftForm.otherSupportingDocs && <UploadedFile title={'Other Supporting Documents'} loading={false} removeFile={() => this.removeFile('otherSupportingDocs')} />}

                        <br /><br />
                        <Row>
                            <Col span={2}>
                            <Link to={'3'}>
                                <Button className="btn" size="large" disabled={uploading}>
                                    <Icon type="left" />
                                </Button>
                            </Link>
                            </Col>
                            <Col span={16} offset={4}>
                                <Button block size="large" htmlType="submit" disabled={uploading}>Save and Continue</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </React.Fragment>
        );
    }
}
export default Form.create()(SupportingDocs);