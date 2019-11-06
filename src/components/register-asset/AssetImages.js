import React from "react";
import { Row, Col, Card, Form, Button, Icon, Upload, Alert } from "antd";
import { Link } from "react-router-dom";
import { ipfsApiConnection } from '../../util/helpers';
import UploadedImage from './uploadedImage';
import PendingImage from './pendingImage';
// import { ipfsUrl } from '../../util/helpers';

class AssetImages extends React.Component {
  state = {
    pendingPrimaryImageFile: null,
    pendingSecondaryImageFiles: [],
    secondaryValidation: {
      validateStatus: '',
      errorMsg: ''
    },
    primaryValidation: {
      validateStatus: '',
      errorMsg: ''
    },
    uploading: false,
    multiUploadCount: 0
  };

  componentDidMount() {
    // console.log('didMount', this.props.draftForm);
  }

  removePrimaryImage = () => {
    // console.log('removing primary');
    this.props.handleFormChange(null, 'primaryImage');
  }

  beforeUploadPrimary = (file) => {
    // console.log('running beforeUpload', file);
    this.setState({uploading: true});
    this.removePrimaryImage();
    let reader = new window.FileReader();
    reader.onload = () => {
      file.status = 'pending';
      this.setState({pendingPrimaryImageFile: file});  
    }
    reader.onloadend = () => {
      // read as buffer and upload to IPFS
      const buffer = Buffer.from(reader.result);
      ipfsApiConnection.add(buffer, (err, ipfsHash) => {
        if (err) {
          file.status = 'error';
          this.setState({uploading: false, pendingPrimaryImageFile: file});
        }
        if (ipfsHash) {
          this.setState({uploading: false, pendingPrimaryImageFile: null});
          this.props.handleFormChange(ipfsHash[0].hash, 'primaryImage');
        }
      });
    }
    reader.readAsArrayBuffer(file);
    return false;
  }

  beforeUploadSecondary = (file) => {
    this.setState({ uploading: true });
    let reader = new window.FileReader();
    reader.onload = () => {
      file.status = 'pending';
      this.setState({ pendingSecondaryImageFiles: [...this.state.pendingSecondaryImageFiles, file] });
      this.setState({multiUploadCount: this.state.multiUploadCount + 1});
    }
    reader.onloadend = () => {
      // read as buffer and upload to IPFS
      const buffer = Buffer.from(reader.result);
      ipfsApiConnection.add(buffer, (err, ipfsHash) => {
        // console.log('secondary uploaded', ipfsHash);
        this.setState({multiUploadCount: this.state.multiUploadCount - 1});
        if (this.state.multiUploadCount === 0) this.setState({uploading: false});
        if (err) {
          this.setState(this.state.pendingSecondaryImageFiles.map((arrayFile) => {
            if (file.uid === arrayFile.uid) {
              file.status = 'error';
            }
            return null;
          }));
        }
        if (ipfsHash) {
          // upload succeeded, remove pendingSecondaryImageFile and add hash to draftForm.secondaryImages
          let filteredPendingSecondaries = this.state.pendingSecondaryImageFiles.filter(arrayFile => file.uid !== arrayFile.uid);
          this.setState({pendingSecondaryImageFiles: filteredPendingSecondaries});
          this.addSecondaryImage(ipfsHash[0].hash);
        }
      });
    }
    reader.readAsArrayBuffer(file);
    return false;
  }

  addSecondaryImage = (hash) => {
    const newSecondaries = this.props.draftForm.secondaryImages ? [...this.props.draftForm.secondaryImages] : [];
    newSecondaries.push(hash);
    this.props.handleFormChange(newSecondaries, 'secondaryImages');
  }

  removeSecondaryImage = (hash) => {
    const newSecondaries = this.props.draftForm.secondaryImages.filter(image => image !== hash);
    this.props.handleFormChange(newSecondaries, 'secondaryImages');
  }

  handleSecondaryChange = (info) => {
    this.setState({ uploading: true, multiUploadCount: info.fileList.length - this.state.pendingSecondaryImageFiles.length });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({uploading: true});
    this.props.form.validateFieldsAndScroll((err, values) => {
        // validate images manually
        const primary = this.validatePrimaryImage();
        const secondary = this.validateSecondaryImages();
        if (!err && primary && secondary) {
          this.props.saveAndContinue();
          this.setState({uploading: false});
        } else {
          this.setState({uploading: false});
        }
    });
  }

  validatePrimaryImage = () => {
    if (!this.props.draftForm.primaryImage) {
      this.setState({ primaryValidation: {
        validateStatus: 'error',
        errorMsg: 'Please upload a primary image.'
      }});
      return false;
    } else {
      this.setState({ primaryValidation: {
        validateStatus: '',
        errorMsg: ''
      }});
      return true;
    }
  }

  validateSecondaryImages = () => {
    if (this.props.draftForm.secondaryImages.length < 3 || this.props.draftForm.secondaryImages.length > 10) {
      this.setState({ secondaryValidation: {
        validateStatus: 'error',
        errorMsg: 'Please upload between 3 and 10 secondary images'
      }});
      return false;
    } else {
      this.setState({ secondaryValidation: {
        validateStatus: '',
        errorMsg: ''
      }});
      return true;
    }
  }

  render() {
    const { uploading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Row>
          <i className="pe-7s-photo header-icon" />
          <div className="header-titles">
            <h1>Asset Images {this.props.tokenId}</h1>
            <h4 className="car-spec-sub">
              Please upload only high quality images in a 6x9 ratio.
            </h4>
          </div>
        </Row>
        <Card className="dash-stat-card">

          <Alert style={{ marginTop: 12 }}  
            message={this.props.warning} 
            type="warning" 
            showIcon />

          <br />

          <Form onSubmit={this.handleSubmit}>

            <Form.Item label="Primary Image" validateStatus={this.state.primaryValidation.validateStatus} help={this.state.primaryValidation.errorMsg }>
              {getFieldDecorator('primaryImage', { initialValue: this.props.draftForm.primaryImage, rules: [{ required: true, message: 'Please upload a primary image.' }], })(
                <Upload listType="picture" beforeUpload={this.beforeUploadPrimary} onRemove={this.removePrimaryImage} accept=".jpg">
                  <Button disabled={uploading}>
                    <Icon type="upload" /> Select File
                  </Button>
                </Upload>
              )}
            </Form.Item>

            { this.state.pendingPrimaryImageFile && <PendingImage file={this.state.pendingPrimaryImageFile} /> }

            { this.props.draftForm.primaryImage &&  
              <UploadedImage hash={this.props.draftForm.primaryImage} removeImage={this.removePrimaryImage} label={ "Primary image" } />
            }

            <Form.Item label="Secondary Images (minimum 3, maximum 10)" validateStatus={this.state.secondaryValidation.validateStatus} help={this.state.secondaryValidation.errorMsg }>
              {getFieldDecorator('secondaryImages', { initialValue: this.props.draftForm.secondaryImages, rules: [{ required: true, message: 'Please upload between 3 and 10 secondary images.' }] })(
                <Upload listType="picture" beforeUpload={this.beforeUploadSecondary} multiple={true} accept=".jpg" >
                  <Button disabled={uploading}>
                    <Icon type="upload" /> Select Files
                  </Button>
                </Upload>
              )}
            </Form.Item>

            { this.props.draftForm.secondaryImages && this.props.draftForm.secondaryImages.map((hash, index) => <UploadedImage key={index} hash={hash} removeImage={() => this.removeSecondaryImage(hash)} label={"Secondary image " + (index +1)} /> )}
            { this.state.pendingSecondaryImageFiles.map((file, index) => <PendingImage key={index} file={file} /> )}

            <br /><br />
            <Row>
              <Col span={2}>
                <Link to={'2'}>
                    <Button className="btn" size="large" disabled={uploading}>
                      <Icon type="left" />
                    </Button>
                </Link>
              </Col>
              <Col span={16} offset={4}>
                  <Button block size="large" htmlType="submit" disabled={uploading}>
                    Save and Continue
                  </Button>
              </Col>
            </Row>

          </Form>
        </Card>
      </React.Fragment>
    );
  }
}
export default Form.create()(AssetImages);
