import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const PlatformMenuItem = (props) => {

    if(props.isShown !== true) {
        return "";
    }

    if(props.children) {
        return props.children;
    }

    const linkContent = <React.Fragment>
        <i className={props.iconClass} />
        <span className={props.reduce ? "menu-text-reduce" : "menu-text"}>{props.text}</span>
    </React.Fragment>

    if(props.linkTo && props.linkTo.startsWith('http')) {
        return <a onClick={props.onClose} href={props.linkTo} target="_blank">
            {linkContent}
        </a>;
    }

    return <Link onClick={props.onClick} to={props.linkTo}>
        {linkContent}     
    </Link>;
};

PlatformMenuItem.propTypes = {
    isShown: PropTypes.any,
    onClick: PropTypes.func,
    linkTo: PropTypes.string,
    iconClass: PropTypes.string,
    text: PropTypes.string
};

PlatformMenuItem.defaultProps = {
    isShown: true
};

export default PlatformMenuItem;