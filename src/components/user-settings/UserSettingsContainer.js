import React from 'react';
import { connect } from 'react-redux';
import AdminConfig from './AdminConfig';
import UserWalletManager from '../address-book/UserWalletManager';

class UserSettingsContainer extends React.Component {
    
    render() {
        return (
        <React.Fragment>
            {this.props.currentUser && this.props.currentUser.isAdmin && <AdminConfig>
            <hr /></AdminConfig>}
            {/* {<UserWalletManager />} */}
        </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.UIstate.currentUser
    }
}

export default connect(mapStateToProps)(UserSettingsContainer);