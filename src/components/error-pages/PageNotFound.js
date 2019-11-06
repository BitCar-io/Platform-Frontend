import React from 'react';
import { Row, Card, Icon} from "antd";
import { Link } from 'react-router-dom';
import { URL_DASHBOARD, URL_ALL_ASSETS } from '../../util/platformNavigation';

const PageNotFound = () => {
    return <Card className="dash-stat-card">
        <div className="asset-not-found-container">
            <Row>
                <Icon type="warning" className="stop-sign" />
            </Row>
            <Row>
                <span className="error-code">404</span>
            </Row>
            <Row>
                <p>Sorry, that road's a dead-end.</p>
                Turn around and <Link to={URL_DASHBOARD} className="link-highlight">go back to your garage</Link> or <Link to={URL_ALL_ASSETS} className="link-highlight"> browse available cars here</Link>.
            </Row>
        </div>
    </Card>
}
export default PageNotFound;