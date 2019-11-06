import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Checkbox, Button } from 'antd';
import { MEMBERSHIP_STEPS } from './Membership';
import { trimAddress } from '../../util/helpers';
import { COLD_WALLET_TEXT } from '../../util/globalVariables';

interface IMembershipQuestionsProps {
    coinbase: string,
    onContinue: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void)
}

class MembershipQuestions extends React.Component<IMembershipQuestionsProps> {
    state = {
        traderRegistrationMessages: [
            // { id: 1, message: <span>
            //     <ul>
            //         <li>
            //             I will ensure I am visiting the correct BitCar platform URL to help prevent any phishing attacks.
            //         </li>
            //         <li>
            //             I understand that BitCar is not liable for any losses incurred from the use of incorrect websites
            //         </li>
            //     </ul>
            // </span>, checked: false },
            { id: 1, message: <span>
                <div>
                    <div>
                        I agree that if I share the private key for any of my wallets with anyone, it will compromise the security of my wallet and could lead to loss of funds or car fractions.
                    </div>
                    <div>
                        I understand that should I lose access to my wallet, BitCar is unable to assist in regaining access to it.
                    </div>
                    <div>
                        I understand that no one from BitCar will ever ask for my private key nor request tokens to be transferred outside of the platform.
                    </div>
                </div>
            </span>, checked: false },
            { id: 2, message: <div>
                You will have a <strong>one-time</strong> only opportunity to add an additional '{COLD_WALLET_TEXT}' wallet to your account as part of this registration process.
                <div>
                    I have checked that <span className="wallet-highlight">{this.props.coinbase}</span> is the wallet I want to register onto the BitCar platform for purchasing and trading car fractions.
                </div>
            </div>, checked: false }
        ],
        registrationEnabled: false
    }

    onCheckboxClick = (id:number) => {

        let newTraderRegMessages = this.state.traderRegistrationMessages.map(item => 
          (item.id === id) ? {...item, checked: !item.checked} : item);

        this.setState({registrationEnabled: newTraderRegMessages.filter(item => !item.checked).length === 0, traderRegistrationMessages: newTraderRegMessages});
    }

    render(){
        const isContinueDisabled = !this.state.registrationEnabled;
        return <React.Fragment>
            <h3 className="membership-subtitle">Please read the following messages carefully and be sure to click each one.</h3>
            {this.state.traderRegistrationMessages.map(item =>
                <Card className="dash-stat-card" key={item.id}>
                    <Row>
                        <Col className="clickable" span={24} onClick={() => this.onCheckboxClick(item.id)}>{item.message}</Col>
                        <Col span={24} className="align-center">
                            <Checkbox className="register-check" onChange={() => this.onCheckboxClick(item.id)} checked={this.state.traderRegistrationMessages[item.id -1].checked}>
                                I Agree with the terms above
                            </Checkbox>
                        </Col>
                    </Row>
                </Card>
            )}
            <br />
            <Button type="primary" className="btn-center membership-continue" onClick={this.props.onContinue}
                disabled={isContinueDisabled}
                title={isContinueDisabled ? "You must agree to all of the above before you can continue" : undefined}>
                Continue
            </Button>
            <br /><br />
        </React.Fragment>
    }
}

export default MembershipQuestions;