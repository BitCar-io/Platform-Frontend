import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from "antd";
import { ipfsUrl } from '../../util/helpers';

const AssetSupportingDoc = (props) => (
    <Col sm={12} xs={24} className="supporting-document">
        <a href={ipfsUrl + props.supportingDocument} target="_blank" rel="noopener noreferrer">
            <i className="supporting-doc far fa-file-pdf"></i> {props.text}
        </a>
    </Col>
);

AssetSupportingDoc.propTypes = {
    supportingDocument: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default AssetSupportingDoc;