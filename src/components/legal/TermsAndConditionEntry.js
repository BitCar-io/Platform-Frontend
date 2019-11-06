import React from 'react';
import PropTypes from 'prop-types';

const TermsAndConditionEntry = (props) => {
    return (<React.Fragment>
        <h3>
            <span className="terms-number">{props.entryPoint}.</span>{props.entryTitle}
        </h3>
        <div>
            {props.text && <p>
                {props.text}
            </p>}
            {props.subPoints && <table>
                <tbody>{props.subPoints.map((subPoint, index) => <tr key={index}>
                        <td className="terms-sub-number">
                            {subPoint.key}
                        </td>
                        <td>
                            {subPoint.topText}
                            {subPoint.subPoints && <table>
                                    <tbody>{subPoint.subPoints.map((pointSubPoint, index) => <tr key={index}>
                                        <td className={`terms-sub-number terms-sub-sub-number ${index === 0 ? "" : "terms-sub-sub"}`}>
                                            {pointSubPoint.key}
                                        </td>
                                        <td className={index === 0 ? "" : "terms-sub-sub"}>
                                            {pointSubPoint.text}
                                        </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            }
                            {subPoint.bottomText && <div className="terms-bottom-text">{subPoint.bottomText}</div>}
                        </td>
                    </tr>)}
                </tbody>
            </table>}
        </div>
    </React.Fragment>);
}

TermsAndConditionEntry.propTypes = {
    entryPoint: PropTypes.string.isRequired,
    entryTitle: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
    subPoints: PropTypes.array
};

export default TermsAndConditionEntry;