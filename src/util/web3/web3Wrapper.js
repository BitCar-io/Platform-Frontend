import ErrorWrapper from '../../classes/ErrorWrapper';
import Web3SendResponse from '../../classes/Web3SendResponse';
import { UNEXPECTED_ERROR, RECEIPT_NOERROR_STATUS_FALSE } from './errorMessaging';

export function callEthereumMethod(method, transactionObject) {
    return new Promise((resolve, reject) => {
        // method.call(transactionObject, null, (error, result) => {
        //     if(error) {
        //         reject(processError(error));
        //     } else {
        //         resolve(result);
        //     }
        // }).catch(error => reject(processError(error)));
        method.call(transactionObject).then((result) => {
            resolve(result);
        }).catch(error => reject(processError(error)));
    });
}

export function sendTransaction(callFirst, web3, method, transactionObject) {
    
    return sendEthereumMethod(web3, method, transactionObject);
    
    // console.log('sendTransaction', callFirst);

    // return new Promise(async (resolve, reject) => {

    //     if(true) {
    //         console.log('Call ethereum on send');
    //         method.call(transactionObject).then(console.log);
    //         method.call(transactionObject).then(result => {
    //             console.log('Call ethereum on send Finished');
    
    //             // if(error) {
    //             //     console.log('CALL ERROR2', error);
    //             //     reject(processError(error));
    //             // } else {

    //             if(result) {

    //                 const keys = Object.keys(result);

    //                 resolve(receivedReceipt(result));

    //                 console.log('SEND CALL RESULT', result);
    //                 console.log('SEND CALL RESULT KEYS', keys.join(','));
                    
    //             }

                    
    //                 console.log("SEND AFTER CALL");
    //                 //resolve(sendEthereumMethod(web3, method, transactionObject));
    //             // }
    //         }).catch(error => {
    //             console.log("Send Call Error", error);
    //         })


    //         // const callResult = await callEthereumMethod(method, transactionObject);
            
    //         // console.log("RESULT 2", callResult);
    //         // .then((result) => {

    //         //     console.log("INISDE THEN");

    //         //     console.log("CALL-RESULT", result);

    //         //     if(result === true) {
    //         //         resolve(sendEthereumMethod(web3, method, transactionObject));
    //         //     } else {
    //         //         reject(processError(result));
    //         //     }
    //         // }).catch(callError => reject(processError(callError)));
    //     } else {
    //         console.log("SNED NO CALL");
    //         //return sendEthereumMethod(web3, method, transactionObject);
    //     }
    // });
}

function sendEthereumMethod(web3, method, transactionObject) {
    return new Promise((resolve, reject) => {
        method.send(transactionObject, (error, transactionHash) => {
            if(error) {
                reject(processError(error));
                // console.error("sendMethod FAILED");
                return;
            }
            waitForReceipt(resolve, reject, web3, transactionHash);
        }).catch(sendError => reject(processError(sendError)));
    });
}

export function processError(error) {
    // console.log("ERROR", error);

    return new Web3SendResponse(null, [new ErrorWrapper(error)], false);
}

function waitForReceipt(resolve, reject, web3, transactionHash, waitCheck) {
    web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
        if(error) {
            //console.error("Error retrieving receipt", error);
            reject(processError(error));
            return;
        }

        if(receipt !== null) {
            if(receipt.status === true) {
                resolve(receivedReceipt(receipt));
            } else {

                if(!waitCheck) {
                    // lets wait 2.5 seconds, as this is a pathway that shouldn't be hit
                    setTimeout(() => waitForReceipt(resolve, reject, web3, transactionHash, true), 2500);
                    console.warn("Received a status=false with no error from blockchain - attempting to retrieve the receipt again.");
                    return;
                }

                reject(receivedReceipt(receipt, true));
            }
        } else {
            //console.log("Waiting for receipt...");
            setTimeout(() => waitForReceipt(resolve, reject, web3, transactionHash), 1000);
        }
    });
}

function receivedReceipt(receipt, hasErrored) {
    
    //console.log("Successful send", receipt);
    return new Web3SendResponse(receipt, hasErrored ? [new ErrorWrapper(RECEIPT_NOERROR_STATUS_FALSE)] : null);
}