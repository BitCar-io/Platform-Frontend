import React from 'react';
import {Link} from 'react-router-dom';
import { Form, Input, Select, Button, Alert, Tooltip, Icon } from 'antd';
import regions from '../../util/data/countries';
import { connect } from 'react-redux';
import { ETHGATEWAY, COLD_WALLET_TEXT, HOT_WALLET_TEXT } from '../../util/globalVariables';
import { RANK_LEVELS_LOWERCASE } from '../../core/rankTracking';
import { contractAddressLength, doStringsMatchIgnoringCase } from '../../util/helpers';
import * as _ from 'lodash';
import { isValidWalletAddress } from '../../core/walletManagement';
import DobEntry from './DobEntry';
import countries from '../../util/data/countries';
import { URL_FAQ_STORAGE_WALLET, URL_MEMBERSHIP_BASE } from '../../util/platformNavigation';
import MembershipPersonalData from '../../classes/MembershipPersonalData';
import ButtonWithConfirmation from '../ButtonWithConfirmation';

const Option = Select.Option;

class MembershipPersonalInfo extends React.Component {

    state = {
        isPending: false,
        hasProvidedStorageAddress: false
    }

    isFormValid = () => {
        return new Promise((resolve, reject) => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                resolve(!err);
            });
        });
    }

    handlePersonalInfoContinue = (e) => {
        
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {

                let country = this.getCountry(values.region);

                let region = country ? country.whitelistCode : null;

                let membershipData = new MembershipPersonalData(values.firstName, values.lastName, values.email, new Date(values.dobYear, values.dobMonth - 1, values.dobDay), country);

                const rank = _.indexOf(RANK_LEVELS_LOWERCASE, this.props.match.params.rank);

                const storageWallet = values.storageWallet;

                if (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[0]) this.props.submitFormBronze(membershipData, region, rank, storageWallet);
                if (this.props.match.params.rank === RANK_LEVELS_LOWERCASE[1]) {
                    this.props.setPersonalInfo(membershipData);
                    this.props.setMembershipProcessData(region, rank, storageWallet);
                    this.props.history.push(`${URL_MEMBERSHIP_BASE}${RANK_LEVELS_LOWERCASE[1]}/1`);
                }
            }
        });
    }

    getCountry(alpha3Code) {
        return countries.find(country => country.alpha3Code === alpha3Code);
    }

    getCountryRegion = (alpha3Code) => {
        const country = this.getCountry(alpha3Code);
        return country ? country.whitelistCode : null;
    }

    validateEmail = (rule, value, callback) => {

        if(!value || value.length === 0) {
            callback();
            return;
        }

        if(!/\S+@\S+\.\S+/.test(value)) {
            callback("Please enter a valid email address.");
            return;
        }

        if(countries.find(country => country.isBlacklisted && country.topLevelDomain.split(',').find(domain => value.endsWith(domain)))) {
            callback("This email domain is not supported for membership at BitCar.");
            return;
        }

        callback();
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
        
        // validation succeeds
        callback();
    }

    validateRegion = (rule, value, callback) => {
        if (value === undefined) {
            callback();
            return;
        }

        const country = this.getCountry(value);

        // if validation fails
        if (!country || country.isBlacklisted) {
        callback(`Country is not allowed.`);
            return;
        }
        // validation succeeds
        callback();
    }

    render() {
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const hasErrors = this.props.hasErrors(getFieldsError());

        return <Form autoComplete="off">
                    <Form.Item label={'Country of Residence'}>
                        {getFieldDecorator('region', {rules: [{ required: true, message: 'Please enter your country of residence.'}, {validator: this.validateRegion}] })(
                            <Select showSearch
                                placeholder="Select country of residence"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                autoComplete="off"
                            >
                            { regions.filter(region => region.displayToUser).sort(region => region.sortOrder).map((region, i) => <Option key={i} value={region.alpha3Code}>{region.name} {region.name === region.nativeName ? "" : `(${region.nativeName})`}</Option>) }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'First Name'}>
                        {getFieldDecorator('firstName', {initialValue: this.props.personalInfo.firstName, rules: [{ required: true, message: 'Please enter your first name.' }], })(
                            <Input type="text" autoComplete="off" />
                        )}
                    </Form.Item>
                    <Form.Item label={'Last Name'}>
                        {getFieldDecorator('lastName', {initialValue: this.props.personalInfo.lastName, rules: [{ required: true, message: 'Please enter your last name.' }], })(
                            <Input type="text" autoComplete="off" />
                        )}
                    </Form.Item>
                    <DobEntry form={this.props.form} data={this.props.personalInfo} />
                    <Form.Item label={'Email'}>
                        {getFieldDecorator('email', {initialValue: this.props.personalInfo.email, rules: [{ required: true, message: 'Please enter your email address' }, {validator: this.validateEmail}], })(
                            <Input type="email" autoComplete="off" />
                        )}
                    </Form.Item>
                    <Form.Item label={`'${HOT_WALLET_TEXT}' Wallet Address`}>
                        {this.props.coinbase && <div className="membership-wallet-address">{this.props.coinbase}</div> }
                        {!this.props.coinbase && <div className="membership-wallet-missing">
                            <div className="membership-wallet-address">Wallet not found</div>
                            <Alert type="error" message={"Please unlock the account you want to register in  " + ETHGATEWAY + "." } showIcon />
                        </div> }
                    </Form.Item>
                        <Form.Item label={
                        <Tooltip placement="top" title="BitCar strongly recommends the use of a 'cold' secondary storage address, such as a hardware wallet (Ledger, Trezor etc.) for security reasons" >
                        Additional '{COLD_WALLET_TEXT}' wallet address (optional, but recommended) <Icon type="question-circle" />
                        </Tooltip>
                        }>
                            {getFieldDecorator('storageWallet', {rules: [{validator: this.validateWalletAddress}] })(
                                <Input type="text" autoComplete="off" maxLength={contractAddressLength} />
                            )}
                            <Link to={URL_FAQ_STORAGE_WALLET} target="_blank">Click here for more information about the secondary storage address</Link>
                        </Form.Item>

                    <br />
                    <ButtonWithConfirmation onConfirm={this.handlePersonalInfoContinue} onValidation={this.isFormValid} cancelText={"No"} okText={"Yes - Register"} requiresConfirmation={!this.state.hasProvidedStorageAddress} title="Are you sure you want to Register without a Storage Address?"
                    buttonProps={{htmlType:"submit", className:"membership-continue", disabled:!this.props.coinbase || hasErrors, block: true}}>
                        {hasErrors ? "Validation Errors - please check above" : "Submit Registration Request"}
                    </ButtonWithConfirmation>
                </Form>
    }
}
const mapStateToProps = (state) => {
    return {
      coinbase: state.UIstate.coinbase,
      web3: state.UIstate.web3,
      currentUser: state.UIstate.currentUser
    }
}
export default connect(mapStateToProps)(Form.create()(MembershipPersonalInfo));
