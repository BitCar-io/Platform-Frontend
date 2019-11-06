import React from "react";
import PropTypes from 'prop-types';
import { Icon, Popover } from "antd";
import { Link } from "react-router-dom";
import SearchResultCard from './SearchResultCard';
import { URL_ALL_ASSETS } from "../../util/platformNavigation";

class SearchResultPopup  extends React.Component {

    constructor(props) {
      super(props);
      this.state = { showResults: undefined };
    }

    hideResults = () => {
        this.setState({
            showResults: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({showResults: visible});

    }

    render() {
        return (
            <Popover title="Search Results" overlayClassName="asset-search-result-overlay" 
            visible={this.state.showResults && this.props.results !== undefined && this.props.results !== null && this.props.results.length > 0}
            onVisibleChange={this.handleVisibleChange}
            placement="bottom"
            trigger="click"
            content={
                this.props.results &&
                <div className="asset-search-result-card">
                    <Icon type="close" className="asset-search-close" onClick={this.hideResults} />
                    {this.props.results.map((car, index) => {
                        return <React.Fragment key={index}>
                            {index < 5 && <SearchResultCard result={car} /> }
                            {index === 5 && <Link to={URL_ALL_ASSETS} className="asset-search-result">Search returned {this.props.results.length} results, refine your search or view all cars</Link>}
                            {index < 5 && index + 1 < this.props.results.length && <hr />}
                            </React.Fragment>
                    })}
                </div>
            }>
            {this.props.children}
            </Popover>
        );
    };
}

SearchResultPopup.propTypes = {
  results: PropTypes.array
};

export default SearchResultPopup;
