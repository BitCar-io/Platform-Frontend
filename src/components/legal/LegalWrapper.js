import React from 'react';
import { Row, Col } from 'antd';

const LegalWrapper = (props) => {
    return <React.Fragment>
            <Row className="legal-wrapper">
                <Col span={2} className="option-column no-print">
                </Col>
                <Col span={20} className="legal-text print">
                    {props.children}
                </Col>
                <Col span={2} className="no-print">
                </Col>
            </Row>
        </React.Fragment>
}

export default LegalWrapper;