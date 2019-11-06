import React from 'react';
import { Col, Card, Button, Row, Icon } from 'antd';
import { connect } from 'react-redux';
import {RANK_LEVELS, RANK_LEVELS_LOWERCASE} from '../../core/rankTracking';
import { MEMBERSHIP_STEPS } from './Membership';
import { setDocumentTitle } from '../../util/helpers';
import Login from '../header-bar/Login';

const currentLevel = <Button size="large" disabled title="You are already registered as a member at this level">
        <i className="fas fa-user"></i>Current Membership Level
    </Button>;

const MembershipIntro = (props) => {

    if (props.hasJustRegistered) {
        return <Row>
            <Col span={8} offset={8}>
                <Card className="dash-stat-card">
                <h3>Registration complete - your account has been successfully registered on the BitCar platform.</h3>
                </Card>
            </Col>
        </Row>
    }

    const unlockWallet = props.currentUser && props.currentUser.coinbase ? "" : <Login unlockButtonText=" Unlock Wallet to Register" unlockButtonClass="ant-btn ant-btn-lg"/>;
    const comingSoon = <div className="membership-card-call-to-action">
        {unlockWallet || <Button size="large" disabled title="This membership level is not currently available">
                <i className="fas fa-user-plus"></i>Coming Soon
            </Button>}
    </div>;

    setDocumentTitle('Membership');
    return <React.Fragment>
        <Row>
            <div className="spec-title">Register as a member</div>
        </Row>
        <Row gutter={24}>
            <Col md={{span: 24}} lg={{span: 24}} xl={{span: 8}}>
                <Card className="membership-card">
                    <div className={`membership-card-header background-${RANK_LEVELS_LOWERCASE[0]}`}>
                        <h2>{RANK_LEVELS[0]}</h2>
                        {/* <p>Basic membership level.</p> */}
                    </div>
                    <div className="membership-card-body">
                        <ul>
                            <li><Icon type="check" /> No membership fees</li>
                            <li><Icon type="check" /> Lowest-level entry to platform</li>
                            {/* <li><Icon type="check" /> Daily purchase limit of TBC fractions per car</li>
                            <li><Icon type="check" /> Platform limit of TBC fractions per car, per day across all members</li>
                            <li><Icon type="check" /> Maximum purchase limit of TBC fractions per member for life of {RANK_LEVELS[0]} membership</li> */}
                        </ul>
                        <div className="membership-card-call-to-action">
                            {unlockWallet || (props.currentUser && !props.currentUser.rank ? 
                            <Button size="large" onClick={() => props.history.push(`${RANK_LEVELS_LOWERCASE[0]}/${MEMBERSHIP_STEPS.accept}`)}>
                                <i className="fas fa-user-plus"></i>Register as Bronze Member
                            </Button> : currentLevel)}
                        </div>
                        {/* { !unlockWallet && props.currentUser.rank === '0' && currentLevelComponent } */}
                    </div>
                </Card>
            </Col>
            <Col md={{span: 24}} lg={{span: 24}} xl={{span: 8}}>
                <Card className="membership-card">
                    <div className={`membership-card-header background-${RANK_LEVELS_LOWERCASE[1]}`}>
                        <h2>{RANK_LEVELS[1]}</h2>
                        {/* <p>For higher volume trading.</p> */}
                    </div>
                    <div className="membership-card-body">
                        <ul>
                            <li><Icon type="check" /> No membership fees</li>
                            <li><Icon type="check" /> Higher level membership perks</li>
                            {/* <li><Icon type="check" /> Higher daily purchase limit</li>
                            <li><Icon type="check" /> Higher maximum purchase limit</li>
                            <li><Icon type="check" /> Higher platform membership limit</li> */}
                        </ul>
                        {/* { process.env.NODE_ENV === 'development' && props.currentUser && (!props.currentUser.rank || props.currentUser.rank === '0') && <div className="membership-card-call-to-action">
                            <Button htmlType="button" onClick={() => props.history.push(`${RANK_LEVELS_LOWERCASE[1]}/accept`)} block>Join - development only</Button>
                        </div> } */}
                        {comingSoon}
                        {/* <div className="coming-soon membership-card-call-to-action">Coming soon</div> */}
                        {/* { props.currentUser && props.currentUser.rank === '1' && currentLevelComponent } */}
                    </div>
                </Card>
            </Col>
            <Col md={{span: 24}} lg={{span: 24}} xl={{span: 8}}>
                <Card className="membership-card">
                    <div className={`membership-card-header background-${RANK_LEVELS_LOWERCASE[2]}`}>
                        <h2>{RANK_LEVELS[2]}</h2>
                        {/* <p>For even higher volume trading.</p> */}
                    </div>
                    <div className="membership-card-body">
                        <ul>
                            <li><Icon type="check" /> No membership fees</li>
                            <li><Icon type="check" /> Higher level membership perks</li>
                            {/* <li><Icon type="check" /> Higher daily purchase limit</li>
                            <li><Icon type="check" /> Higher maximum purchase limit</li>
                            <li><Icon type="check" /> Higher platform membership limit</li> */}
                        </ul>
                        {comingSoon}
                    </div>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.UIstate.currentUser,
        hasJustRegistered: state.UserState.hasJustRegistered
    }
}
export default connect(mapStateToProps)(MembershipIntro);
