import React from 'react';
import AssetList from './asset-listing/AssetList';
import {Row, Col, Card, Collapse} from 'antd';
import { setDocumentTitle } from '../util/helpers';
import * as _ from 'lodash';
import { USEFUL_LINKS } from '../util/globalVariables';

const {Panel} = Collapse;

class Home extends React.Component {

    componentDidMount() {
        setDocumentTitle('Home');
    }

    render() {
        
        const customPanelStyle = {
        background: '#2f323b',
        borderRadius: 0,
        marginBottom: 0,
        border: 0,
        overflow: 'hidden',
      };
        return <React.Fragment>
            <Row>
                    <Collapse bordered={false} className="home-collapse" accordion>
                        <Panel header="Click to read how we are making the impossible, possible..." style={customPanelStyle}>
                        <Card className="dash-stat-card">
                        <h2>For the collectable car world, this changes everything. Now anyone can be a
    part of it.</h2>
                    <p>Classic supercars really are the stuff of dreams. Beautifully designed, meticulously crafted and powered by
    ferocious engines. They're also one of the best performing asset classes of the past 10 years. It's no surprise
    that the world's wealthiest invest in these dream machines. As for the rest of us, they've always remained just
    a dream, until now...</p>
    <p>
    BitCar's revolutionary fractional ownership platform changes all the rules and makes it possible for anyone to
    own part of a collectable for as little as $25. You could be a part-owner of our first car, a historic Ferrari 599 GTO, in less than a minute thanks to our blockchain-driven platform, which ensures your investment is a swift
    and completely secure one. What's more, you don't have to worry about any of the upkeep of your new car -
    it's all covered.
    </p>
    <p className="homepage-highlight">What's more, you can now purchase parts of the car without cryptocurrency!</p>
    <p className="homepage-highlight">That's right - BitCar now supports payments via PayPal - allowing you to buy with credit card and direct bank transfer, all securely through PayPal - you don't even need a PayPal account to do this!</p>
    <p>The stuff of dreams has now become a reality...</p>
                    
                    </Card>
                        </Panel>
                        <Panel header="Useful BitCar links" style={customPanelStyle}>
                            <Card className="dash-stat-card homepage-link-card">
                        {_.map(USEFUL_LINKS, (value, index) => <div key={index} className="homepage-link"><a href={value.url} target="_blank">{value.type} - {value.title}</a></div>)}
                            </Card>
                        </Panel>
                    </Collapse>
            </Row>
            <AssetList />
        </React.Fragment>
    }
}
export default Home;