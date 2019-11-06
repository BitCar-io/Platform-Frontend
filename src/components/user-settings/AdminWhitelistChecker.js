import React from 'react';
import { connect } from 'react-redux';
import {Form, Icon, Input, Button} from 'antd';
import UserWalletManager from '../address-book/UserWalletManager';
import {sendTransaction, callEthereumMethod} from '../../util/web3/web3Wrapper';
import {getWhitelistContract} from '../../core/tokenPurchase';
import { loadPlatformKycProcessTracker } from '../../core/user';

class AdminWhitelistChecker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isWhitelisted: undefined,
            addressToCheck: undefined
        };
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const address = values['address'];

            this.setState({addressToCheck: address, isWhitelisted: "Waiting for confirmation..."});
            
            this.checkWhitelist(address);
          }
        });
      }

      checkWhitelist = async (address) => {

        const platformWhitelist = await getWhitelistContract(this.props.web3);

        let hasErrored = false;
        const isWhitelisted = await callEthereumMethod(platformWhitelist.methods.isWhitelisted(address, [999])).catch(error => {
            console.error('Error checking whitelist', error);
            hasErrored = true;
        });

        const kycProcessTracker = await loadPlatformKycProcessTracker(this.props.web3);

        const customerData = await callEthereumMethod(kycProcessTracker.methods.getCustomer(address)).catch(error => {
            console.error('Error getting customer data', error);
            hasErrored = true;
        });

        console.log('customerData: ', customerData);

        this.setState({isWhitelisted: hasErrored ? "Error" : isWhitelisted ? "yes" : "no"});
    }

    hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    render() {

        if(!(this.props.currentUser && this.props.currentUser.isAdmin)) {
            return <div>
                Invalid user account for accessing - use Admin.
                </div>
        } else {

            const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

            const addressError = isFieldTouched('userName') && getFieldError('userName');

            return (<React.Fragment>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item
                    validateStatus={addressError ? 'error' : ''}
                    help={addressError || ''}>
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: 'Please input a platform user address to check' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="User Address" />
                        )}
                        </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={this.hasErrors(getFieldsError())}
                        >
                            Check Whitelist
                        </Button>
                    </Form.Item>
                </Form>
                <div>
                    {this.state.addressToCheck && <span>Is address {this.state.addressToCheck} whitelisted for 999?</span>}
                    <br />
                    {this.state.isWhitelisted}
                </div>
                </React.Fragment>
            );

        }
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.UIstate.currentUser,
        web3: state.UIstate.web3
    }
}

export default Form.create()(connect(mapStateToProps)(AdminWhitelistChecker));