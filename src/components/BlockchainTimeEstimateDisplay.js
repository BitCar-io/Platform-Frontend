import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import estimateBlockTime from '../util/web3/blockTimeCalculator';
import BigNumber from 'bignumber.js';

class BlockchainTimeEstimateDisplay extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            estimatedBlockTime: undefined,
            isLoading: false
        };
    }

    componentDidMount() {
        this.getEstimate();
    }

    componentDidUpdate(prevprops) {

        if(prevprops.getEstimate !== this.props.getEstimate) {
            this.getEstimate();
        }
    }

    componentWillUnmount() {
    }

    getEstimate = async () => {

        let estimatedBlockTime = undefined;

        if(!this.state.isLoading && this.props.getEstimate === true) {

            this.setState({isLoading: true});

            estimatedBlockTime = await estimateBlockTime(this.props.web3, 50).catch(error => {
                console.error("Error retrieving block time estimate", error);
              });

            if(estimatedBlockTime) {
                estimatedBlockTime = new BigNumber(estimatedBlockTime * 1.5).toFormat(1);
            }

            this.setState({isLoading: false});
        }
        
        if(this.state.estimatedBlockTime !== estimatedBlockTime) {
            this.setState({estimatedBlockTime: estimatedBlockTime});
        }
    }

    render() {
        return (<div className="buy-estimate" style={this.props.color ? {color: this.props.color} : {}}>
        Please do not close or refresh your browser.
        {this.state.estimatedBlockTime && <div>
            It is estimated that this could take more than {this.state.estimatedBlockTime} seconds to complete.
          </div>
        }
        </div>);
    }
}

BlockchainTimeEstimateDisplay.propTypes = {
    getEstimate: PropTypes.bool
};

  BlockchainTimeEstimateDisplay.defaultProps = {
};

const mapStateToProps = (state) => {
    return {
      web3: state.UIstate.web3
    }
  }
export default connect(mapStateToProps)(BlockchainTimeEstimateDisplay);