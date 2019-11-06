import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from "antd";
import Web3SendResponse from '../classes/Web3SendResponse';
import Web3Receipt from './Web3Receipt'
import { FRIENDLY_ERROR_MESSAGES, UNEXPECTED_ERROR } from '../util/web3/errorMessaging';

const Web3ResponseHandler = (props) => {

    if(!props.web3Response.hasErrored) {
        return (<Alert className="align-left" type={ props.typeOverride ? props.typeOverride : "success"} showIcon 
        message={
            <span className="web3-response-title">Success
                <br />
                <span className="web3-response-message">
                    {props.successMessage}
                </span>
            </span>} />);
    } else {
    
        const unexpectedErrorMessage = (<span>{FRIENDLY_ERROR_MESSAGES[UNEXPECTED_ERROR].message} <Web3Receipt receipt={props.web3Response.receipt} /> </span>);
        const errorCount = props.web3Response.errors ? props.web3Response.errors.length : 0;
        const hasMoreThanOneError = errorCount > 1;
        const firstError = props.web3Response.errors && props.web3Response.errors[0] ? props.web3Response.errors[0] : undefined;
        const errorTitle = hasMoreThanOneError ? "Errors encountered, please review the feedback below" : firstError ? firstError.platformMessage.title : "Unexpected Error";
        return (<Alert className="align-left" type={ props.typeOverride ? props.typeOverride : "error"} showIcon 
            message={
                <span className="web3-response-title">{errorTitle}
                    <br />
                    <span className="web3-response-message">
                        {!hasMoreThanOneError && (firstError ? firstError.platformMessage.message : unexpectedErrorMessage)}
                        {!hasMoreThanOneError && firstError && firstError.additionalMessage && <React.Fragment>
                            <br />
                            {firstError.additionalMessage}
                        </React.Fragment>}
                        {hasMoreThanOneError && <ul>
                            {props.web3Response.errors.map((error, i) => 
                                <li key={i}>
                                    <div className="stat-title"><strong>{error.platformMessage.title}</strong></div>
                                    <div className="stat-body">{error.platformMessage.message}</div>
                                    {error.additionalMessage && <div className="stat-body">{error.additionalMessage}</div>}
                                </li>
                            )}
                            </ul>}
                    </span>
                </span>} />);
    }
};

Web3ResponseHandler.propTypes = {
    web3Response: PropTypes.instanceOf(Web3SendResponse),
    successMessage: PropTypes.string,
    typeOverride: PropTypes.string
  };

export default Web3ResponseHandler;