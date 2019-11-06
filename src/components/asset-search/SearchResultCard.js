import React from "react";
import PropTypes from 'prop-types';
import { Col, Row } from "antd";
import { Link } from 'react-router-dom';
import { URL_ASSET } from "../../util/platformNavigation";

const SearchResultCard = props => {
  return <Row className="asset-search-result" key={props.key}>
    <Col>
      {props.result && props.result.address && props.result.data ?
      <Link to={URL_ASSET + props.result.address}>
        <span className="text-sub-headline-font font-22">
          <span className="text-brand-main">{props.result.data.make}</span> {props.result.data.model} ({props.result.data.year})
        </span>
      </Link> : <span>Error loading result</span>}
    </Col>
  </Row>
};

SearchResultCard.propTypes = {
  result: PropTypes.object.isRequired,
  key: PropTypes.number.isRequired
};

export default SearchResultCard;
