import React from 'react';
import PropTypes from 'prop-types';

const LoadingComponent = (props) => {
    return (
        <React.Fragment>
            <div className="loading loading ant-col ant-col-12">
                <img src={props.image} className="loading-image" />
                <p>{props.text}</p>
            </div>
        </React.Fragment>
    );
};

LoadingComponent.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  };

export default LoadingComponent;