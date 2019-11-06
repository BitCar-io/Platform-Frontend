import * as _ from 'lodash';
import { FRIENDLY_ERROR_MESSAGES, PLATFORM_ERRORS, UNEXPECTED_ERROR, WEB3_ERRORS } from '../util/web3/errorMessaging';

class ErrorWrapper {

    rawError;
    errorCode;
    platformMessage;
    additionalMessage;

    constructor(rawError, additionalMessage) {
        this.rawError = rawError;

        let errorDetail = this.getErrorDetailsFromCode(rawError);

        if(!errorDetail && this.rawError.message) {
            errorDetail = this.getErrorDetails(rawError.message);

        } else if(!errorDetail) {
            errorDetail = this.getErrorDetails(rawError);
        }

        this.errorCode = errorDetail.errorCode;
        this.platformMessage = this.getErrorMessage(errorDetail.defaultMessage, errorDetail.errorCode);
        this.additionalMessage = additionalMessage;

        if(this.errorCode === UNEXPECTED_ERROR) {
            console.error(this.errorCode, rawError);
        }
    }

    isErrorCode(rawError) {
        return _.keys(FRIENDLY_ERROR_MESSAGES).indexOf(rawError) >= 0;
    }

    getErrorDetailsFromCode(errorCode) {

        const errorMessage = FRIENDLY_ERROR_MESSAGES[errorCode];

        if(!errorMessage) {
            return undefined;
        }

        return {defaultMessage: errorMessage, errorCode: errorCode};
    }

    getErrorDetails(errorMessage) {

        let errorDetail = this.getErrorDetailsFromText(PLATFORM_ERRORS, errorMessage);

        if(!errorDetail) {
            errorDetail = this.getErrorDetailsFromText(WEB3_ERRORS, errorMessage);
        }
        
        return errorDetail ? errorDetail : {defaultMessage: FRIENDLY_ERROR_MESSAGES[UNEXPECTED_ERROR], errorCode: UNEXPECTED_ERROR};
    }

    getErrorDetailsFromText(errorCodeMap, errorMessage) {

        if(!errorMessage) {
            return undefined;
        }

        const errorMessages = _.keys(errorCodeMap);
        const errorMessageIndex = errorMessages ? errorMessages.findIndex((message, index, obj) => errorMessage.indexOf(message) >= 0) : -1;

        if(errorMessageIndex < 0) {
            return undefined;
        }

        const errorCodes = _.values(errorCodeMap);
        return {defaultMessage: errorMessages[errorMessageIndex], errorCode: errorCodes[errorMessageIndex]};
    }

    getErrorMessage(defaultMessage, errorCode) {

        const friendlyMessage = FRIENDLY_ERROR_MESSAGES[errorCode];

        if(friendlyMessage) {
            return friendlyMessage;
        }
        
        return {title:errorCode, message: defaultMessage};
    }
}

export default ErrorWrapper;
