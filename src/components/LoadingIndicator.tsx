import React from "react";
import PropTypes from 'prop-types';
// import { Spin } from "antd";

const spinner_wheel = require('../img/wheel.svg');

interface ILoadingIndicator {
  align?:string;
  className?:string
  size?:number;
  text?:string;
}

const LoadingIndicator = (props:ILoadingIndicator) => {
  return <div className={`align-${props.align} ${props.className}`}>
      <img src={spinner_wheel} className="spin" width={props.size ? props.size : 20} height={props.size ? props.size : 20} />
      <div>{props.text ? props.text : "Loading, Please Wait..."}</div>
    </div>
};

LoadingIndicator.propTypes = {
  text: PropTypes.string,
  align: PropTypes.string
};

LoadingIndicator.defaultProps = {
  align: "center"
};

export default LoadingIndicator;