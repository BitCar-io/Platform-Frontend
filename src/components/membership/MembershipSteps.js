import React from 'react';
import store from '../../store';
import MembershipPersonalInfo from "./MembershipPersonalInfo";
import PhotoEvidence from './PhotoEvidence';
import Selfie from './Selfie';
import { MEMBERSHIP_RESPONSE } from '../../util/globalVariables';
import { Alert } from 'antd';
import { signData } from '../../util/web3/documentTracking';
import { getOrLoadPlatformContract } from '../../util/web3/contracts';
import { sendTransaction, callEthereumMethod } from '../../util/web3/web3Wrapper';
import { KYC_API_URL, emptyAddress } from '../../util/helpers';
import axios from 'axios';
import toBuffer from 'blob-to-buffer';
import JSZip from 'jszip';
import Web3SendResponse from '../../classes/Web3SendResponse';
import { connect } from 'react-redux';
import { Row, Col, Card, notification} from 'antd';
import MembershipAccept from "./MembershipQuestions";
import { Redirect } from "react-router-dom";
import { RANK_LEVELS_LOWERCASE } from '../../core/rankTracking';
import * as _ from 'lodash';
import MembershipTC from './MembershipTC';
import { MEMBERSHIP_STEPS } from './Membership';
import { URL_MEMBERSHIP_REGISTRATION } from '../../util/platformNavigation';
import { isValidWalletAddress } from '../../core/walletManagement';
import { getMembershipServerErrorMessage } from '../../util/web3/errorMessaging';
import MembershipModal, { RegistrationStatus } from './MembershipModal';
import { createUser } from '../../core/user';
import { setUserJustRegistered } from '../../actions';

class MembershipSteps extends React.Component {

    state = {
        isPending: false,
        membershipData: undefined,
        membershipRank: undefined,
        storageWalletAddress: undefined,
        whitelistId: undefined,
        personalInfo: {},
        photoEvidence: {},
        errorMessage: undefined,
        registrationStatus: RegistrationStatus.ValidatingForm,
        membershipProcessData: {},
        invalid: false
    }

    componentDidUpdate(prevprops) {
        if(prevprops.coinbase !== this.props.coinbase) {
            this.setState({invalid: true});
        }
    }

    hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    setPersonalInfo = (data) => {
        this.setState({ personalInfo: data })
    }

    setMembershipProcessData = (region, membershipRank, storageWallet) => {
        // console.log('props-region', region);
        // console.log('props-membershipRank', membershipRank);
        // console.log('props-storageWallet', storageWallet);

        this.setState({ membershipProcessData: {region: region, membershipRank: membershipRank, storageWallet: storageWallet} });
    }

    setPhotoEvidence = (data) => {
        this.setState({ photoEvidence: data })
    }

    setSelfie = (personalPhoto) => {
        this.submitForm(this.state.personalInfo, this.state.photoEvidence, personalPhoto, this.state.membershipProcessData.region, this.state.membershipProcessData.membershipRank, this.state.membershipProcessData.storageWallet);
    }

    submitFormBronze = async (membershipData, whitelistId, rank, storageWallet) => {

        console.log(membershipData, whitelistId, rank, storageWallet);

        this.setState({ isPending: true, membershipData: membershipData, membershipRank: rank, storageWalletAddress: storageWallet, whitelistId: whitelistId });
    }

    validateServerResponse = (status) => {
        // console.log('validating', status);
        // console.log('is req valid?', (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid);
        // standard responses, but allow invalid headers as just testing for geo and server state 
        return (status >= 200 && status < 300) || status === MEMBERSHIP_RESPONSE.invalid;
    }

    submitKycRequest = async (personalInfo, region, membershipRank, storageWallet, photoEvidence, personalPhoto) => {
        this.setState({ registrationStatus: RegistrationStatus.ValidatingForm });
        this.clearError();

        axios.get(process.env.REACT_APP_KYC_API_READ_BASE_URL, {
            validateStatus: this.validateServerResponse
        }).then(async response => {
            
            let storageWalletAddress = storageWallet;

            if(!isValidWalletAddress(this.props.web3, storageWallet)) {
                storageWalletAddress = emptyAddress;
            }

            let zippedFile = await this.zipFile(personalInfo, photoEvidence, personalPhoto);
            toBuffer(zippedFile, async (err, buffer) => {
                if (err) {
                    throw err;
                }

                this.setState({ registrationStatus: RegistrationStatus.Signing });

                signData(this.props.coinbase, buffer, this.props.web3).then( async (signature) => {
                    console.log("Signed", signature);
                    this.setState({ registrationStatus: RegistrationStatus.Submitting });
                    let docsTrackerContract = await getOrLoadPlatformContract('KycProcessTracker', this.props.web3);
                    sendTransaction(true, this.props.web3, docsTrackerContract.methods
                        .submitDocumentDigestAndSignature(region, membershipRank, storageWalletAddress, 0, signature.h, signature.v, signature.r, signature.s), { from: this.props.coinbase })
                        .then(success => {
                            this.setState({ registrationStatus: RegistrationStatus.Confirming });
                            this.sendZippedFileToServer(zippedFile, this.props.coinbase, signature.h).then(result => {
                                this.setState({ isPending: false });
                                notification.success({
                                    message: 'Registration Complete',
                                    className: 'notification-success',
                                    duration: 6,
                                    placement: 'bottomRight'
                                });
                            }).catch(error => {

                                const statusCode = error.response && error.response.status ? error.response.status : 0;
                                this.generateStatusError(error, statusCode);
                            });
                    }, error => this.handleError('Digest submission error', error));
                }, error => this.handleError('Error signing data', error));
            });

        }).catch(error => {
            const statusCode = error.response && error.response.status ? error.response.status : 0;
            const errorMessage = getMembershipServerErrorMessage(statusCode);
            this.handleError('', error, errorMessage);
        });
    }

    generateStatusError = (error, status) => {

        let userMessage = getMembershipServerErrorMessage(status);

        this.handleError('Error sending file to server', error, userMessage);
    }

    zipFile = (personalInfo, photoEvidence, personalPhoto) => {
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

    submitForm = async (personalInfo, photoEvidence, personalPhoto, region, rank, storageWallet) => {

        // console.log('Passed personal info', personalInfo);

        // console.log('pre-region', this.state.membershipProcessData.region);
        // console.log('pre-membershipRank', this.state.membershipProcessData.membershipRank);
        // console.log('pre-storageWallet', this.state.membershipProcessData.storageWallet);
        // console.log('submitting form');
        this.setState({ isPending: true });
        // if user has already registered, we need to get their PersonalInfo back from the blockchain
        if (_.isEmpty(personalInfo)) {
            // console.log("Data from blockchain");
            let KycProcessTracker = await getOrLoadPlatformContract('KycProcessTracker', this.props.web3);
            const customerData = await callEthereumMethod(KycProcessTracker.methods.getCustomer(this.props.coinbase));
            // console.log('customerData', customerData);
            this.setMembershipProcessData(customerData._region, _.indexOf(RANK_LEVELS_LOWERCASE, this.props.match.params.rank), customerData._storageAddr);
        }

        // console.log('region', this.state.membershipProcessData.region);
        // console.log('membershipRank', this.state.membershipProcessData.membershipRank);
        // console.log('storageWallet', this.state.membershipProcessData.storageWallet);

        return await this.submitKycRequest(personalInfo, region, rank, storageWallet, photoEvidence, personalPhoto);
    }

    sendZippedFileToServer = (zipFile, walletAddress, documentDigest) => {
        const fdata = new FormData();
        fdata.append('file', zipFile);

        return axios({
            url: KYC_API_URL,
            method: 'POST',
            headers: {
                'wallet-address': walletAddress,
                'document-digest': documentDigest
            },
            data: fdata
        });
    }

    clearError = () => {
        this.setState({ errorMessage: undefined });
    }

    handleError = (label, error, message) => {

        this.setState({ isPending: false, registrationStatus: RegistrationStatus.ValidatingForm });
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
        this.setState({errorMessage: <Alert type="error" message={userMessage} showIcon />});
        return;
    }

    onHasErrored = () => {
        this.setState({isPending: false});
    }

    onRegistrationComplete = (coinbase) => {
        store.dispatch(setUserJustRegistered());
        createUser(coinbase, this.props.web3);
    }

    onAcceptedMessages = () => {
        this.props.history.push(MEMBERSHIP_STEPS.termsAndConditions);
    }

    onTermsComplete = (isExistingMember) => {
        this.props.history.push(!isExistingMember ? MEMBERSHIP_STEPS.step0 : MEMBERSHIP_STEPS.step1);
    }
    
    render() {
        const step = this.props.match.params.step;
        const rank = this.props.match.params.rank;

        const isPreStep = step === MEMBERSHIP_STEPS.accept || step === MEMBERSHIP_STEPS.termsAndConditions;
        
    if(this.state.invalid || !this.props.coinbase) {
        return <Redirect to={URL_MEMBERSHIP_REGISTRATION} />
    } else {
        return (
            <Row type="flex" justify="center">
                <Col xs={{span: 24}} xl={{span: 24}}>
                    <Row>
                        <div className="spec-title">Register as a {rank} member</div>
                    </Row>
                    { step === MEMBERSHIP_STEPS.accept && <MembershipAccept coinbase={this.props.coinbase} onContinue={this.onAcceptedMessages} /> }
                    { step === MEMBERSHIP_STEPS.termsAndConditions && <MembershipTC onTermsComplete={this.onTermsComplete} handleError={this.handleError} clearError={this.clearError} /> }
                    { !isPreStep && <Card className="dash-stat-card">
                        {/* { rank === RANK_LEVELS_LOWERCASE[0] && <Redirect to={`${URL_MEMBERSHIP_BASE}${RANK_LEVELS_LOWERCASE[0]}/${MEMBERSHIP_STEPS.step0}`} /> }
                        { rank === RANK_LEVELS_LOWERCASE[1] && this.props.currentUser && <Redirect to={`${URL_MEMBERSHIP_BASE}${RANK_LEVELS_LOWERCASE[1]}/${this.props.currentUser.rank ? 1 : 0}`} /> } */}
                        
                        { step === MEMBERSHIP_STEPS.step0 && <MembershipPersonalInfo personalInfo={this.state.personalInfo} setPersonalInfo={this.setPersonalInfo} setMembershipProcessData={this.setMembershipProcessData} 
                            history={this.props.history} match={this.props.match} submitFormBronze={this.submitFormBronze} hasErrors={this.hasErrors} clearError={this.clearError} handleError={this.handleError} /> }
                        { step === MEMBERSHIP_STEPS.step1 && <PhotoEvidence photoEvidence={this.state.photoEvidence} setPhotoEvidence={this.setPhotoEvidence} match={this.props.match}
                            history={this.props.history} /> }
                        { step === MEMBERSHIP_STEPS.step2 && <Selfie match={this.props.match} history={this.props.history} setSelfie={this.setSelfie} /> }
                        {this.state.errorMessage && <div className="membership-error">
                            {this.state.errorMessage}
                        </div>}

                        <MembershipModal coinbase={this.props.coinbase} isVisible={this.state.isPending} membershipApiBaseUrl={process.env.REACT_APP_KYC_API_READ_BASE_URL} membershipData={this.state.membershipData} membershipRank={this.state.membershipRank} onHasErrored={this.onHasErrored} onRegistrationComplete={this.onRegistrationComplete} photoEvidence={this.state.photoEvidence} personalPhoto={this.state.personalPhoto} storageWalletAddress={this.state.storageWalletAddress} web3={this.props.web3} whitelistId={this.state.whitelistId}   />
                    </Card> }
                </Col>
            </Row>
            )
        }
    }
}
const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3,
        coinbase: state.UIstate.coinbase,
        currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(MembershipSteps);