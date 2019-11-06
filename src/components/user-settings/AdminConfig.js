import React from 'react';
import { Col, Row, Table } from 'antd';
import AdminWhitelistChecker from './AdminWhitelistChecker';
import AssetLimitConfig from './AssetLimitConfig';

const { Column } = Table;
const data = [{
    key: '1',
    address: '0x9c92f55e6885c5d351d2fc4443c0658b68c02a8c',
    country: 'Italy',
    code: 'ITA'
},
{
    key: '2',
    address: '0x7da27fa62ca4f1964d8b656d5d7bd7278c54196d',
    country: 'Australia',
    code: 'AUS'
},
{
    key: '3',
    address: '0x44d6cdcf2a7f543c9f5e0cee7f2a0cdd8dc6b67b',
    country: 'Singapore',
    code: 'SGP'
},
{
    key: '4',
    address: '0x82d666b8a032e35d96164c418d0df73c9514155b',
    country: 'United Kingdom',
    code: 'GBR'
},
{
    key: '5',
    address: '0x6bbaaeb9dacc437f0b8e17a726e9b4ca8bb3e452',
    country: 'Germany',
    code: 'DEU'
},
{
    key: '6',
    address: '0xa673635c7998693aa7a3ae7e2fe13dab74209edd',
    country: 'Switzerland',
    code: 'CHE'
},
{
    key: '7',
    address: '0xcc15364e19e0cbdc9aa0a489c5dc2ead49458f4e',
    country: 'Bulgaria',
    code: 'BGR'
},];

class AdminConfig extends React.Component {
    
    render() {
        return <React.Fragment>
            <h1>Admin Configuration</h1>
            <br />
            <AdminWhitelistChecker />
            <hr />
            <AssetLimitConfig />
            {/* <Row>
            <h3>User Whitelist</h3>
            <Table dataSource={data} className="admin-config-whitelist-table">
                <Column
                    title="Address"
                    dataIndex="address"
                    key="address"
                />
                <Column
                    title="Country"
                    dataIndex="country"
                    key="country"
                />
                <Column
                    title="Code"
                    dataIndex="code"
                    key="code"
                />
            </Table>
            </Row> */}
        </React.Fragment>
    }
}
export default AdminConfig;