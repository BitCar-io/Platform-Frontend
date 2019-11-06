import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from "antd";
import * as _ from 'lodash';

const Web3Receipt = (props) => {
    return ( !props.receipt ? "" :
    <React.Fragment>
        <Collapse bordered={false}>
            <Collapse.Panel header="View Blockchain Receipt"><ul>{_.keys(props.receipt).map((key, index) => <li key={index}>{key}:{props.receipt[key]}</li>)}</ul></Collapse.Panel>
        </Collapse>
    </React.Fragment>
    );
};

Web3Receipt.propTypes = {
    receipt: PropTypes.object
  };

export default Web3Receipt;