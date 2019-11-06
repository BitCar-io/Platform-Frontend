import React from "react";
import { Steps, Row, Col} from "antd";
import PrimaryInfo from './PrimaryInfo';
import SecondaryInfo from './SecondaryInfo';
import AssetImages from './AssetImages';
import SupportingDocs from './SupportingDocs';
import CompleteRegistration from './CompleteRegistration';
import { getAssetDraft, setAssetDraft } from '../../util/assetDraftAPI';
import { setDocumentTitle } from '../../util/helpers';

const Step = Steps.Step;
const warning = 'All uploaded information will be publicly accessible, please ensure you do not upload any personal or sensitive information.'

class RegisterAsset extends React.Component {

  state = {
    draftFound: false,
    draftForm: {}
  };

  constructor() {
    super();
    const draft = getAssetDraft();
    if (draft !== null) {
      this.state = { draftFound: true, draftForm: draft };
    }
  }

  componentDidMount() {
    setDocumentTitle('Register New Asset');
  }

  handleFormChange = (event, field) => {
    // console.log(event, field);
      let data;
      if (event === undefined) { return; }
      if (event && event.target) { // field is input
          if (event.target.type === 'checkbox') {
            data = event.target.checked;
           } else {
            data = event.target.value;
           }
      } else { // field is selection
          data = event;
      }
      if (event === null) {data = undefined;}

      if(field.startsWith("supportingDocuments-")) {
        console.log("DRAFT FORM SECONDARY DATA STATE TEST 1", this.state.draftForm);

        const secondaryField = field.split("supportingDocuments-")[1];
        this.setState({ draftForm: { ...this.state.draftForm, ...[field], [secondaryField]: data }});

        console.log("DRAFT FORM SECONDARY DATA STATE TEST 2", this.state.draftForm);

      } else {
        this.setState({ draftForm: { ...this.state.draftForm, [field]: data }});
      }

      
      // console.log(this.state.draftForm);
  }

  getStatus = (step) => {
    const currentStep = parseInt(this.props.match.params.step, 8);
    if (currentStep === step) { return 'current'; }
    if (currentStep > step ) { return 'complete'; }
    if (currentStep < step ) { return 'incomplete'; }
  }

  saveAndContinue = (path) => {
    setAssetDraft(this.state.draftForm);
    this.props.history.push(path);
  }

  render() {
    const step = this.props.match.params.step;
    return (
      <div style={{minWidth: 350}}>
        <Row style={{ marginTop: 25 }}>
            <Steps>
                <Step status={this.getStatus(1)} title="Primary Information" icon={<i className="pe-7s-note2" />} />
                <Step status={this.getStatus(2)} title="Secondary Information" icon={<i className="pe-7s-note2" />} />
                <Step status={this.getStatus(3)} title="Images" icon={<i className="pe-7s-photo" />} />
                <Step status={this.getStatus(4)} title="Supporting Docs" icon={<i className="pe-7s-paperclip" />} />
                <Step status={this.getStatus(5)} title="Submit" icon={<i className="pe-7s-check" />} />
            </Steps>
        </Row>
        <Row style={{ marginTop: 50 }}>
          <Col xs={{span:24, offset:0}} sm={{span:22, offset:1}} md={{span:16, offset:4}} lg={{span:12, offset:6}} xl={{span:10, offset:7}}>
            { step === '1' && <PrimaryInfo warning={warning} handleFormChange={this.handleFormChange} draftForm={this.state.draftForm} draftFound={this.state.draftFound} saveAndContinue={() => this.saveAndContinue('2')}  />  }
            { step === '2' && <SecondaryInfo warning={warning} handleFormChange={this.handleFormChange} draftForm={this.state.draftForm} draftFound={this.state.draftFound} saveAndContinue={() => this.saveAndContinue('3')}  />  }
            { step === '3' && <AssetImages warning={warning} handleFormChange={this.handleFormChange} draftForm={this.state.draftForm} draftFound={this.state.draftFound} saveAndContinue={() => this.saveAndContinue('4')} />  }
            { step === '4' && <SupportingDocs warning={warning} handleFormChange={this.handleFormChange} draftForm={this.state.draftForm} draftFound={this.state.draftFound} saveAndContinue={() => this.saveAndContinue('5')} history={this.props.history} />  }
            { step === '5' && <CompleteRegistration warning={warning} draftForm={this.state.draftForm} draftFound={this.state.draftFound}  />  }
          </Col>
        </Row>
      </div>
    );
  }
}
export default RegisterAsset;
