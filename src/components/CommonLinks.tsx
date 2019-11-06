import React from 'react';
import { Link } from "react-router-dom";
import { URL_TERMS_AND_CONDITIONS, URL_RETURNS_POLICY } from '../util/platformNavigation';
import { History } from 'history';

export const ReturnsPolicyLink = () => {
    return <HighlightedPlatformLink to={URL_RETURNS_POLICY} title="Open Returns Policy in new window" text="Returns Policy" />
}

export const TermsAndConditionsLink = () => {
    return <HighlightedPlatformLink to={URL_TERMS_AND_CONDITIONS} title="Open Terms and Conditions in new window" text="Terms and Conditions" />
}

interface IHighlightedPlatformLink {
    to:History.LocationDescriptor<any>;
    title:string;
    text:string;
    classNameOverride?:string;
}

export const HighlightedPlatformLink = (props:IHighlightedPlatformLink) => {
    return <Link to={props.to} target="_blank" className={props.classNameOverride ? props.classNameOverride : "link-highlight"} title={props.title}>{props.text}</Link>
}