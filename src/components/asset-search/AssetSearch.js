import React from "react";
import { Row, Col, Card, Form, Input, Button } from "antd";
import {getAssetByAddress, getAssetsByMakeOrModel, getAssetsByTokenCode} from '../../util/assetHelpers';
import SearchResultPopup from './SearchResultPopup';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { contractAddressLength } from '../../util/helpers';

const minCodeLength = 3;
const validationDebouncems = 500;

class AssetSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = { pending: false, 
      assetsFound: undefined, 
      previousTokenSearch: undefined, 
      previousAssetsFound: undefined };

      this.validateTokenLength = _.debounce(this.validateTokenLength, validationDebouncems);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          var term = values["token"];

          // if(tokenSearch === this.state.previousTokenSearch && this.state.previousAssetsFound !== undefined && this.state.previousAssetsFound !== null) {
          //   this.setState({ pending:false, assetsFound:this.state.previousAssetsFound, previousTokenSearch: tokenSearch });
          //   return;
          // }

          // this.setState({ pending:true, assetsFound:null, previousTokenSearch: tokenSearch, previousAssetsFound: null});

          const assets = this.searchAssets(term);

        }
    });
  }

  searchAssets = (term) => {
  
    let assets;
    let hasErrored;

    try {
      if(term.length === contractAddressLength) {

        let asset = getAssetByAddress(this.props.loadedAssets, term);

        if(!asset && this.props.unapprovedAssets && this.props.currentUser.canAccessUnapprovedAssets) {
          asset = getAssetByAddress(this.props.unapprovedAssets, term);
        }

        assets = asset ? [asset] : [];

      } else {
        assets = getAssetsByTokenCode(this.props.loadedAssets, term);

        if(assets.length === 0 && this.props.unapprovedAssets && this.props.currentUser.canAccessUnapprovedAssets) {
          assets = getAssetsByTokenCode(this.props.unapprovedAssets, term);
        }

        if(assets.length === 0) {
          assets = getAssetsByMakeOrModel(this.props.loadedAssets, term);
  
          if(assets.length === 0 && this.props.unapprovedAssets && this.props.currentUser.canAccessUnapprovedAssets) {
            assets = getAssetsByMakeOrModel(this.props.unapprovedAssets, term);
          }
        }
      }
    } catch (error) {
      hasErrored = true;
    }
  
    // this.setState({ pending:false, assetsFound:assets, previousTokenSearch: term, previousAssetsFound: assets});

    if(!assets || assets.length === 0) {
      this.props.form.setFields({
        token: {
          value: term,
          errors: [new Error(hasErrored ? "An error occurred whilst searching, please try again." : "No Cars found matching this criteria")]
        }
      })
    }
    return assets;
  }

  validateTokenLength = (rule, value, callback) => {

      if(value === undefined) {
        callback();
        return;
      }
  
      if(value.length === 0) {
        callback();
        return;
      }
      else if(value.length < minCodeLength) {
        // console.log("length check");
        callback('Please provide at least three characters to search for.');
        return;
      } else if(value.length > contractAddressLength) {
        callback(`Ethereum contract address should not exceed ${contractAddressLength} characters`);
        return;
      }
  
      callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col md={{span:12}} xl={{span:24}}>
          {/* <i className="pe-7s-search header-icon font-26" style={{ width: 30}} />
          <span className="text-sub-headline-font font-22 text-white">Car Token Search {this.props.tokenId}</span> */}
          {/* <Card className="dash-stat-card asset-search"> */}
          {!this.props.loadedAssets && <div>Please wait for car data to load...</div>}
          {this.props.loadedAssets && <Form>
              <Form.Item name="token" style={{marginTop: 15, marginBottom: 0}}>
              {getFieldDecorator('token', { rules: [{ required: true, message: 'Please enter make, model, token code, or address...' }, {validator: this.validateTokenLength}], })(
              <Input htmltype="text"onKeyUp={this.handleSubmit} placeholder="Search by Make, model, token code or address..." id="assetsearch" maxLength={contractAddressLength} autoComplete="off" disabled={!this.props.loadedAssets} />
              )}
              </Form.Item>
              {/* <SearchResultPopup results={this.state.assetsFound}>
                <Button block size={'small'} htmlType="submit" onClick={this.handleSubmit} loading={this.state.pending} disabled={!this.props.loadedAssets || this.state.pending}>{this.state.pending ? "Searching..." : "Search"}</Button>
              </SearchResultPopup> */}
            </Form>}
          {/* </Card> */}
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loadedAssets: state.AssetState.loadedAssets,
    unapprovedAssets: state.AssetState.unapprovedAssets,
    currentUser: state.UIstate.currentUser
  }
}

export default Form.create()(connect(mapStateToProps)(AssetSearch));
