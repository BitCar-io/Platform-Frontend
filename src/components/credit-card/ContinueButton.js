import React from 'react';
import { Button } from "antd";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../../store';
import { updateCurrentCreditCardStep } from '../../actions';
import { scrollToTop } from '../../util/helpers';

class ContinueButton extends React.Component {

    nextStep = (e) => {

        e.preventDefault();

        if(this.props.onValidation === undefined) {
            this.goToNextStep();
            return;
        }
        
        if(!this.props.onValidation()) {
            return;
        }

        this.goToNextStep();
    }

    goToNextStep = () => {
        store.dispatch(updateCurrentCreditCardStep(this.props.currentStep + 1));
        this.setState({canContinue: false});
        scrollToTop();
    }

    render() {
        const canContinue = !this.props.isDisabled && true;
        return <Button size={'large'} onClick={this.nextStep} disabled={!canContinue}>Continue</Button>
    }
}

ContinueButton.propTypes = {
    isDisabled: PropTypes.bool, 
    onValidation: PropTypes.func
};

ContinueButton.defaultProps = {
    isDisabled: false
}

const mapStateToProps = (state) => {
    return {
        currentStep: state.CreditCardPayment.currentStep
    }
}

export default connect(mapStateToProps)(ContinueButton);