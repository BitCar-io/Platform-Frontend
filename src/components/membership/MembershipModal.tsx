import axios from 'axios';
import React from 'react';
import JSZip from 'jszip';
import * as _ from 'lodash';
import { Modal, Alert, notification } from 'antd';
import { ETHGATEWAY, MEMBERSHIP_RESPONSE } from '../../util/globalVariables';
import MetaMaskNotification from '../MetaMaskNotification';
import BlockchainTimeEstimateDisplay from '../BlockchainTimeEstimateDisplay';
import LoadingIndicator from '../LoadingIndicator';
import MembershipPersonalData from '../../classes/MembershipPersonalData';
import { isValidWalletAddress } from '../../core/walletManagement';
import toBuffer from 'blob-to-buffer';
import { signData } from '../../util/web3/documentTracking';
import { sendTransaction } from '../../util/web3/web3Wrapper';
import { getOrLoadPlatformContract } from '../../util/web3/contracts';
import { getMembershipServerErrorMessage } from '../../util/web3/errorMessaging';
import Web3SendResponse from '../../classes/Web3SendResponse';
import Web3 from 'web3';
import { KYC_API_URL, emptyAddress } from '../../util/helpers';

export enum RegistrationStatus {
    ValidatingForm = 0,
    Signing = 1,
    Submitting = 2,
    Confirming = 3
}

interface IMembershipModalProps {
    coinbase:string;
    onHasErrored:(() => void);
    onRegistrationComplete:((coinbase:string) => void);
    isVisible:boolean;
    membershipApiBaseUrl:string;
    membershipData:MembershipPersonalData;
    membershipRank:number;
    photoEvidence?:any;
    personalPhoto?:any;
    storageWalletAddress:string;
    web3:Web3;
    whitelistId:number;
}

interface IMembershipModalState {
    errorMessage?:any;
    registrationStatus:RegistrationStatus;
}

class MembershipModal extends React.Component<IMembershipModalProps, IMembershipModalState> {

    constructor(props:IMembershipModalProps) {
        super(props);

        this.state = {
            registrationStatus: RegistrationStatus.ValidatingForm
        };
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevprops:IMembershipModalProps) {
        if(this.props.isVisible && this.props.isVisible !== prevprops.isVisible) {
            this.submitKycRequest(this.props.membershipData, this.props.whitelistId, this.props.membershipRank, this.props.storageWalletAddress, this.props.photoEvidence, this.props.personalPhoto);
        }
    }

    clearError = () => {
        this.setState({ errorMessage: undefined });
    }

    generateStatusError = (error:any, status:number) => {

        let userMessage = getMembershipServerErrorMessage(status);

        this.handleError(error, undefined, userMessage);
    }

    handleError = (error:any, title?:string, message?:string) => {

        this.setState({ registrationStatus: RegistrationStatus.ValidatingForm });
        let userMessage = '';
        if (message) {
            userMessage = message;
        } else {
            if (error instanceof Web3SendResponse) {
                userMessage = error.errors[0].platformMessage.message;
            } else {
                console.error("Unexpected error occurred!", error);
                userMessage = "An unexpected error has occurred, please try again."
            }
        }
        this.setState({errorMessage: <Alert type="error" message={title} description={userMessage} showIcon />});
        this.props.onHasErrored();
        return;
    }

    submitKycRequest = async (membershipData:MembershipPersonalData, whitelistId:number, membershipRank:number, storageWallet:string, photoEvidence:any, personalPhoto:any) => {
        this.setState({ registrationStatus: RegistrationStatus.ValidatingForm });
        this.clearError();

        axios.get(this.props.membershipApiBaseUrl, {
            validateStatus: this.validateServerResponse
        }).then(async (response:any) => {

            let storageWalletAddress = storageWallet;

            if(!isValidWalletAddress(this.props.web3, storageWalletAddress)) {
                storageWalletAddress = emptyAddress;
            }

            let zippedFile = await this.zipFile(membershipData, photoEvidence, personalPhoto);
            toBuffer(zippedFile, async (err:any, buffer:any) => {
                if (err) {
                    throw err;
                }

                this.setState({ registrationStatus: RegistrationStatus.Signing });

                signData(this.props.coinbase, buffer, this.props.web3).then( async (signature) => {
                    console.log("Signed", signature);
                    this.setState({ registrationStatus: RegistrationStatus.Submitting });
                    let docsTrackerContract = await getOrLoadPlatformContract('KycProcessTracker', this.props.web3);
                    sendTransaction(true, this.props.web3, docsTrackerContract.methods
                        .submitDocumentDigestAndSignature(whitelistId, membershipRank, storageWalletAddress, 0, signature.h, signature.v, signature.r, signature.s), { from: this.props.coinbase })
                        .then(success => {
                            this.setState({ registrationStatus: RegistrationStatus.Confirming });
                            this.sendZippedFileToServer(zippedFile, this.props.coinbase, signature.h).then(result => {
                                this.registrationComplete(this.props.coinbase);
                            }).catch(error => {

                                if(error.code === 'ECONNABORTED' || error.request) {
                                    console.log('Subscribing to completion event due to axios timeout', error.request, error.code);
                                    this.subscribeToRegistrationEvent(docsTrackerContract, this.props.coinbase);
                                    return;
                                }

                                console.log('sendError', error.code);
                                const statusCode = error.response && error.response.status ? error.response.status : 0;
                                this.generateStatusError(error, statusCode);
                            });
                    }, error => this.handleError(error, 'Submission error'));
                }, error => this.handleError(error, 'Error signing data'));
            });

        }).catch((error:any) => {
            const statusCode = error.response && error.response.status ? error.response.status : 0;
            const errorMessage = getMembershipServerErrorMessage(statusCode);
            this.handleError(error, undefined, errorMessage);
        });
    }

    registrationComplete = (coinbase:string) => {
        notification.success({
            message: 'Registration Complete',
            className: 'notification-success',
            duration: 6,
            placement: 'bottomRight'
        });
        this.props.onRegistrationComplete(coinbase);
    }

    sendZippedFileToServer = (zipFile:Blob, walletAddress:string, documentDigest:string) => {
        const fdata = new FormData();
        fdata.append('file', zipFile);

        return axios({
            url: KYC_API_URL,
            method: 'POST',
            timeout: 5000,
            headers: {
                'wallet-address': walletAddress,
                'document-digest': documentDigest
            },
            data: fdata
        });
    }

    subscribeToRegistrationEvent = (docsTrackerContract:any, coinbase:string) => {
        docsTrackerContract.once('DocumentConfirmed', {filter:{_addr: coinbase}}, (error:any, event:any) => {
            this.registrationComplete(coinbase);
        });
    }

    validateServerResponse = (status:number) => {
        // console.log('validating', status);
        // console.log('is req valid?', (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid);
        // standard responses, but allow invalid headers as just testing for geo and server state 
        return (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid;
    }

    zipFile = (personalInfo:MembershipPersonalData, photoEvidence:any, personalPhoto:any): Promise<Blob> => {
        let zip = new JSZip();
        // create folder to hold our membership files
        let folder = zip.folder('membership');
        if (!_.isEmpty(personalInfo)) {
            let personalText = '';
            Object.keys(personalInfo).forEach((key)  => {
                personalText += key + ': ' + personalInfo[key] + '\n';
            });
            // create a text file for personal details in our membership folder
            folder.file("personal.txt", personalText);
        }
        // if photoEvidence was passed in, include it in the folder
        if (!_.isEmpty(photoEvidence)) {
            let additionalText = '';
            Object.keys(photoEvidence).forEach((key)  => {
                if (key !== 'id') {
                    additionalText += key + ': ' + photoEvidence[key] + '\n';
                }
            });
            let additionalInfo = zip.folder('membership/additional-info');
            additionalInfo.file("additionalText.txt", additionalText);
            additionalInfo.file(photoEvidence.id.file.name, photoEvidence.id.file);
        }
        if (personalPhoto) {
            let selfieFolder = zip.folder('membership/personal-photo');
            selfieFolder.file(personalPhoto.file.name, personalPhoto.file);
        }
        // console.log(zip);
        return zip.generateAsync({type:"blob"});
    }

    render(){

        const props = this.props;
        const state = this.state;

        return <React.Fragment>
                <Modal visible={props.isVisible} centered closable={false} footer={null} >
                <div className="membership-progress">
                    {state.registrationStatus === RegistrationStatus.ValidatingForm && <span>
                            <h2>Validating Membership Form</h2>
                            <p>
                                Please wait while we check your request before submission
                            </p>
                    </span>}
                    {state.registrationStatus === RegistrationStatus.Signing && <span>
                        <h2>Step 1 of 3: Signing submission</h2>
                        <p>
                            Please check {ETHGATEWAY} and sign the request.
                        </p>
                        <MetaMaskNotification className="metamask-notification" newLine={false} />
                    </span>}
                    {state.registrationStatus === RegistrationStatus.Submitting && <span>
                        <h2>Step 2 of 3: Submitting membership request</h2>
                        <p>
                            Please check {ETHGATEWAY} and approve the request.
                        </p>
                        <MetaMaskNotification className="metamask-notification" newLine={false} />
                        <BlockchainTimeEstimateDisplay color="#b8c1ca" getEstimate={state.registrationStatus === RegistrationStatus.Submitting} />
                    </span>}
                    {state.registrationStatus === RegistrationStatus.Confirming && <span>
                        <h2>Step 3 of 3: Confirming Membership Request</h2>
                        <p>Please wait while we complete your membership request.</p>
                        <BlockchainTimeEstimateDisplay color="#b8c1ca" getEstimate={state.registrationStatus === RegistrationStatus.Confirming} />
                    </span>}
                </div>
                <div className="align-center">
                    <LoadingIndicator text=' ' size={40} />
                </div>
            </Modal>
            {this.state.errorMessage && <div className="membership-error">
                {this.state.errorMessage}
            </div>}
        </React.Fragment>
    }
}

export default MembershipModal;