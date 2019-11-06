import React from 'react';
import PropTypes from 'prop-types';

const MetaMaskNotification = props => {
    return (<div className={`metamask-notification ${props.className}`}>
        {props.newLine && <br />}There will be a pop-up or a notification icon, like this one, displayed on the MetaMask plug-in:
        <img src={require('../img/metamask-prompt.jpg')} />
    </div>);
};

MetaMaskNotification.propTypes = {
    className: PropTypes.string,
    newLine: PropTypes.bool
};

MetaMaskNotification.defaultProps = {
    className: '',
    newLine: true
};

export default MetaMaskNotification;