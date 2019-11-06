import React from "react";
import AssetCard from "./AssetCard.js";
import { Row, Col, Checkbox, Card } from "antd";
import { connect } from 'react-redux';
import AssetFilter from './AssetFilter';
import { Skeleton } from 'antd';
import * as _ from 'lodash';
import AssetSearch from "../asset-search/AssetSearch";

class AssetList extends React.Component {
  state = {
      filters: {
        open: true,
        closed: true
      }
  };
  filterChanged = (filterType) => {
    let filters = this.state.filters;
    filters[filterType] = !filters[filterType];
    this.setState({filters : filters})
  }
  render(){
    const assetContracts = this.props.assetContracts;
    const orderedAssets = this.props.loadedAssets && _.orderBy(this.props.loadedAssets, ['approvalDate'], ['desc']);
    return (
    <React.Fragment>
      
      <Row style={{marginBottom: 30}}>
        {/* <Col span={9}>
            <AssetSearch />
        </Col>
        <Col span={15}>
          <div className="asset-filter-label">
            <div style={{marginBottom: 10}}>Filter:</div>
            <Checkbox onChange={() => this.filterChanged('open')} checked={this.state.filters.open}>Open</Checkbox>
            <Checkbox onChange={() => this.filterChanged('closed')} checked={this.state.filters.closed}>Closed</Checkbox>
          </div>
        </Col> */}
      </Row>
      <Row>
          { !this.props.loadedAssets && assetContracts && _.map(assetContracts, (contract, i) => <Skeleton key={i} paragraph={{ rows: 6 }} />)}
          { this.props.loadedAssets && _.map(orderedAssets, (loadedAsset, i) => {
            const carBalance = this.props.assetBalances[loadedAsset.address];
            return (carBalance && <AssetFilter key={i} filters={this.state.filters} car={loadedAsset} carBalance={carBalance}>
                <AssetCard style={{marginBottom: 30}} />
            </AssetFilter>)
          })
          }
      </Row>
    </React.Fragment>
    )
}
}
const mapStateToProps = (state) => {
  return {
    assetContracts: state.AssetState.assetContracts,
    loadedAssets: state.AssetState.loadedAssets,
    assetBalances: state.PlatformEvent.assetBalances
  }
}
export default connect(mapStateToProps)(AssetList);