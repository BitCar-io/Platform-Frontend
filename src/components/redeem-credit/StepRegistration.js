import React from 'react';
import store from '../../store';
import { Form, Input, DatePicker, Button, Icon, Select, Tooltip, Alert, Card, Row, Col } from 'antd';
import moment from 'moment';
import countries from '../../util/data/countries';
import { connect } from 'react-redux';
import { isValidWalletAddress } from '../../core/walletManagement';
import { emptyAddress, doStringsMatchIgnoringCase } from '../../util/helpers';
import MembershipTC from '../membership/MembershipTC';
import ReadOnlyFields from '../credit-card/ReadOnlyFields';
import MembershipQuestions from '../membership/MembershipQuestions';
import MembershipModal from '../membership/MembershipModal';
import { setUserJustRegistered } from '../../actions';
import { getCountry } from '../membership/CountrySelector';
import MembershipPersonalData from '../../classes/MembershipPersonalData';
import IdentityDocument from '../../classes/IdentityDocument';
import ButtonWithConfirmation from '../ButtonWithConfirmation';
import { COLD_WALLET_TEXT, HOT_WALLET_TEXT } from '../../util/globalVariables';
import Country from '../../classes/Country';
import MemberAddress from '../../classes/MemberAddress';
import { createUser } from '../../core/user';

class StepRegistration extends React.Component {
    
    state = {
        acceptedAllQuestions: false,
        termsAgreed: false,
        isPending: false,
        hasProvidedStorageAddress: false
    }

    constructor(props) {
        super(props);
    }

    next = () => {
        this.props.setCurrentStep(this.props.getCurrentStep() + 1);
    }

    prev = () => {
        this.props.setCurrentStep(this.props.getCurrentStep() - 1);
    }

    setStatus = (title, message, type) => {
        this.setState({
            status: {
                title: title,
                message: message,
                type: type
            }
        })
    }

    getNationalities = (nationalitiesCSV) => {
        const allNationalities = nationalitiesCSV.split(',');

        let nationalityCountries = [];
        
        allNationalities.forEach((value, index) => {
            let country = Country.getCountryFromNationality(value);
            if(country) {
                nationalityCountries.push(country);
            }
        });

        return nationalityCountries;
    }

    isFormValid = async () => {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                resolve(!err);
            });
        });
    }

    register = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error(err);
                return
            }

            let storageWalletAddress = values.storageWallet;

            const redeemData = this.props.getRedeemData();
            const kycData = redeemData.kycData;

            const country = Country.getCountryFromName(kycData.countryOfResidence);

            const whitelistId = country.whitelistCode;

            const membershipRank = 0;

            let membershipData = new MembershipPersonalData(kycData.name, '', kycData.email, kycData.dob, country);
            const nationalities = this.getNationalities(kycData.nationalities);
            const placeOfBirth = Country.getCountryFromName(kycData.pob);
            const memberAddress = MemberAddress.fromDetailedString(kycData.address);
            const taxAddress = MemberAddress.fromDetailedString(kycData.taxAddress);
            const identityDocument = new IdentityDocument(kycData.id, kycData.idType);

            membershipData.setAmlData(nationalities, placeOfBirth, kycData.occupation, kycData.employer, memberAddress, taxAddress, identityDocument);

            if(!isValidWalletAddress(this.props.web3, values.storageWallet)) {
                storageWalletAddress = emptyAddress;
            }

            this.setState({ membershipData: membershipData, membershipRank: membershipRank, storageWalletAddress: storageWalletAddress, whitelistId: whitelistId, isPending: true });        
        })
        .catch(error => {
            console.error(error);
            this.setStatus("Registration Error", <React.Fragment>An error occurred whilst processing your platform registration, please try again.<br />{error.message}</React.Fragment>, "error");
        });
    }

    onQuestionsAccepted = (event) => {
        this.setState({acceptedAllQuestions: true});
    }

    componentDidMount() {
        if(this.props.currentUser) {
            if(this.props.currentUser.rank) {
                this.next();
            }
        }
    }

    onTermsComplete = (isExistingMember) => {
        this.setState({termsAgreed: true});
    }

    handleError = (label, error, message) => {

        this.setStatus(undefined, message, "error");
    }

    onHasErrored = (error) => {
        this.setState({isPending: false});
    }

    onRegistrationComplete = (coinbase) => {
        store.dispatch(setUserJustRegistered());
        createUser(coinbase, this.props.web3);
        this.next();
    }

    clearError = () => {
        this.setState({status: null});
    }
    
    validateWalletAddress = (rule, value, callback) => {

        if(!isValidWalletAddress(this.props.web3, value, callback)) {
            this.setState({hasProvidedStorageAddress: false});
            return;
        }

        if(doStringsMatchIgnoringCase(value, this.props.coinbase)) {
            callback(`Your '${COLD_WALLET_TEXT} wallet address has to be different to your '${HOT_WALLET_TEXT}' wallet address.`);
            this.setState({hasProvidedStorageAddress: false});
            return;
        }
        
        // validation succeeds
        this.setState({hasProvidedStorageAddress: true});

        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const redeemData = this.props.getRedeemData();
        const coinbase = this.props.coinbase;

        const fieldItems = [
            <Form.Item key={'region'} label={'Country of Residence'}>
                {getFieldDecorator('region', {initialValue: redeemData.kycData.countryOfResidence})(
                    <Select
                        disabled={true}
                        showSearch
                        placeholder="Select country of residence"
                        optionFilterProp="children"
                        // filterOption={(input, option) => option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        autoComplete="off"
                    >
                    { 
                        countries.map((country, i) => {
                            if(!country.isBlacklisted) {
                                return <Option key={country.name}>{country.name}</Option>
                            }
                        })
                    }
                    </Select>
                )}
            </Form.Item>,
            <Form.Item key={'name'} label={'Name'}>
                {getFieldDecorator('name', {initialValue: redeemData.kycData.name})(
                    <Input disabled={true} type="text" autoComplete="off" />
                )}
            </Form.Item>,
            <Form.Item key={'dateOfBirth'} label="Date of birth">
                {getFieldDecorator('DateOfBirth', {initialValue: moment(redeemData.kycData.dob)})(
                    <DatePicker 
                        disabledDate={(current) => {return moment().year() - current.year() < 18 || current.year() < 1900}}
                        showToday={false}
                        disabled={true}
                        defaultPickerValue={moment().subtract("18", "years")}
                    />
                )}
            </Form.Item>,
            <Form.Item key={'email'} label={'Email'}>
                {getFieldDecorator('email', {initialValue: redeemData.kycData.email})(
                    <Input disabled={true} type="email" autoComplete="off" />
                )}
            </Form.Item>,
            <Form.Item key={'tradingWallet'} label={"Trading Wallet Address"}>
                {getFieldDecorator('tradingWallet', {initialValue: coinbase})(
                    <Input disabled={true} type="tradingWallet" autoComplete="off" />
                )}
            </Form.Item>
        ];

        const userDataValues = {
            region: redeemData.kycData.countryOfResidence,
            name: redeemData.kycData.name,
            dateOfBirth: moment(redeemData.kycData.dob).format('DD MMM YYYY'),
            email: redeemData.kycData.email,
            tradingWallet: coinbase
        }

        const buttonProps = {
            disabled:!this.state.termsAgreed,
            className:"step-next-btn",
            size:'large'
        };

        return (
            <Form layout="vertical" autoComplete="off">
                {!this.state.acceptedAllQuestions && <MembershipQuestions coinbase={this.props.coinbase} onContinue={this.onQuestionsAccepted} />}

                {this.state.acceptedAllQuestions && !this.state.termsAgreed && <Card className="dash-stat-card">
                    <MembershipTC buttonText="Continue" onTermsComplete={this.onTermsComplete} handleError={this.handleError} clearError={this.clearError} />
                </Card>}
                {this.state.termsAgreed && <React.Fragment>
                    <Card className="dash-stat-card" title="User Information Provided at Time of Payment">
                        <Row gutter={16}>
                            <ReadOnlyFields fields={fieldItems} fieldValues={userDataValues} />
                        </Row>
                    </Card>
                    <Row>
                        <Col sm={24} md={12}>
                            <Form.Item key={'storageWallet'} label={
                                <Tooltip placement="top" title="BitCar strongly recommends the use of a 'cold' secondary storage address, such as a hardware wallet (Ledger, Trezor etc.) for security reasons" >
                                Provide an additional 'Storage' wallet address (optional, but recommended) <Icon type="question-circle" />
                                </Tooltip>
                                }>
                                    {getFieldDecorator('storageWallet', {rules: [{validator: this.validateWalletAddress}] })(
                                        <Input autoFocus={true} type="text" autoComplete="off" />
                                    )}
                            </Form.Item>
                        </Col>
                    </Row>
                </React.Fragment>}
                {this.state.status && 
                    <Alert
                        message={this.state.status.title}
                        description={this.state.status.message}
                        type={this.state.status.type}
                        closable
                        onClose={this.state.status = null}
                    />
                }

                <div className="steps-action">
                    <ButtonWithConfirmation onConfirm={this.register} onValidation={this.isFormValid} cancelText={"No"} okText={"Yes - Register"} requiresConfirmation={!this.state.hasProvidedStorageAddress} title="Are you sure you want to Register without a Storage Address?"
                    buttonProps={buttonProps}>Register</ButtonWithConfirmation>
                    <Button className="step-previous-btn" size={'large'} onClick={this.prev}>
                        Previous
                    </Button>
                </div>

                <MembershipModal coinbase={this.props.coinbase} isVisible={this.state.isPending} membershipApiBaseUrl={process.env.REACT_APP_KYC_API_READ_BASE_URL} membershipData={this.state.membershipData} membershipRank={this.state.membershipRank} onHasErrored={this.onHasErrored} onRegistrationComplete={this.onRegistrationComplete} storageWalletAddress={this.state.storageWalletAddress} web3={this.props.web3} whitelistId={this.state.whitelistId} />
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        web3: state.UIstate.web3,
        web3Status: state.UIstate.web3Status,
        connectedNetwork: state.UIstate.connectedNetwork,
        assetContracts: state.AssetState.assetContracts,
        coinbase: state.UIstate.coinbase,
        platformErrorMessage: state.UIstate.platformErrorMessage,
        currentUser: state.UIstate.currentUser
    }
}

export default Form.create()(connect(mapStateToProps)(StepRegistration));