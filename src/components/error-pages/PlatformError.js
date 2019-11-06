import React from 'react';
import { Row, Card, Icon} from "antd";
import { Link } from 'react-router-dom';

const PlatformError = (props) => {
    return <Card className="dash-stat-card">
        <div className="error-container">
            <Row>
                <Icon type="warning" className="stop-sign" />
            </Row>
            <Row>
                <span className="error-code">500</span>
            </Row>
            <Row>
            <h1>Sorry, but BitCar seems to be having difficulty starting its engine, please try again.</h1>
            </Row>
            <Row className="error-details">
                <h2>{props.errorTitle}</h2>
                <br />
                <h3>{props.errorMessage}</h3>
                {props.additionalMessage}
            </Row>
        </div>
    </Card>
}
export default PlatformError;