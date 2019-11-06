import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Alert} from 'antd';

const statusValues = {
    Complete: 'complete',
    Current: 'current',
    Incomplete: 'incomplete'
};

const ApprovalStep = (props) => {
    const status = props.currentStep > props.stepNumber ? statusValues.Complete : props.currentStep === props.stepNumber ? statusValues.Current : statusValues.Incomplete;
    return <React.Fragment>
                <Card className={'approval-step' + ' approval-step-' + status}>
                    <h1>{props.title}</h1>
                    <p>{ props.showDescription && status !== statusValues.Complete && props.description }</p>
                    {status === statusValues.Current && props.children}
                    { props.alert && status === statusValues.Current && <Alert style={{ marginBottom: 12 }}  
                    message={props.alert}
                    type="warning" 
                    showIcon /> }
                    { status === statusValues.Current && props.button }
                    { status === statusValues.Complete && <h1><Icon type="check-circle" className="approval-step-done-icon" />Done</h1> }
                </Card>
                
                {!props.isLastStep && <i className="approval-step-arrow fas fa-2x fa-caret-down"></i>}
            </React.Fragment>
}

ApprovalStep.propTypes = {
    alert: PropTypes.string,
    currentStep: PropTypes.number.isRequired,
    description: PropTypes.string,
    isLastStep: PropTypes.bool,
    stepNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    showDescription: PropTypes.bool
};

ApprovalStep.defaultProps = {
    isLastStep: false,
    showDescription: true
};

export default ApprovalStep;