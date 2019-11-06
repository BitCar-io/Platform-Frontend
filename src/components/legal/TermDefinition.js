import React from 'react';
import PropTypes from 'prop-types';

const TermDefinition = (props) => {
    return (
        <p>
            <span className="terms-highlight">“{props.definition}”</span> {props.text}
        </p>
    );
}

TermDefinition.propTypes = {
    definition: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]).isRequired
};

export default TermDefinition;