import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from "antd";
import AssetSupportingDoc from "./AssetSupportingDoc";

const AssetSupportingDocs = (props) => {
    return (
    <div>
        <div className="card-heading">Supporting Documents</div>
        <Card className="dash-stat-card">
            <Row>
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.certificateAuthenticity} text="Certificate of Authenticity" />
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.provenanceReport} text="Provenance Report" />
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.serviceHistory} text="Service History" />
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.mechanicReport} text="Mechanic Report" />
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.vinImage} text="Vehicle Identification Number" />
                <AssetSupportingDoc supportingDocument={props.supportingDocuments.otherSupportingDocs} text="Other Supporting Docs" />
            </Row>
        </Card>
    </div>
)};

AssetSupportingDocs.propTypes = {
    supportingDocuments: PropTypes.object.isRequired
  };

export default AssetSupportingDocs;