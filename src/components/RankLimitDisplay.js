import React from 'react';
import { RANK_LEVELS } from "../core/rankTracking";
import PropTypes from 'prop-types';
import AssetLimit from "../classes/RankTracker/AssetLimit";
import GlobalLimit from '../classes/RankTracker/GlobalLimit';

const RankLimitDisplay = (props) => (
        <div className="rank-limit-wrapper">
            <span className="rank-limit-title">You are currently a {RANK_LEVELS[props.rank]} member, which has the following restrictions:-</span>
            <ul>
                {props.platformLimit && <li>
                    No more than {props.platformLimit.displayGlobalLimit} fractions can be purchased from BitCar for the life of your {props.platformLimit.rankText} membership ({props.platformLimit.displayQtyAvailable} remaining)
                </li>}
                {props.userLimit && <li>
                    No more than {props.userLimit.displayPeriodLimit} fractions of this car can be bought by you within a {props.userLimit.displayPeriodInHours} hour period.
                </li>}
                {props.memberLimit && <li>
                    No more than {props.memberLimit.displayPeriodLimit} fractions of this car can be bought by all {props.memberLimit.rankText} members within a {props.memberLimit.displayPeriodInHours} hour period.
                </li>}
                {props.hasPeriodStarted === false && <li>
                    The current restriction period starts now.
                </li>}
                {props.hasPeriodStarted === true && props.resetTime && <li>
                    The current restriction period ends in approximately {props.resetTime}.
                </li>}
            </ul>
            <ul className="rank-limit-info">
                {props.userLimit && <li className="rank-limit-allowance">
                    You could purchase {props.userLimit.displayQtyAvailable} more fractions right now.
                </li>}
                {props.memberLimit && <li className="rank-limit-allowance">
                    You could purchase {props.memberLimit.displayQtyAvailable} more fractions right now.
                </li>}
                {props.platformLimit && <li className="rank-limit-allowance">
                    You could purchase {props.platformLimit.displayQtyAvailable} more fractions for the life of your {props.platformLimit.rankText} membership.
                </li>}
                {props.buyQty && <li className="rank-limit-qty">
                    You were attempting to purchase {props.buyQty} fractions in this transaction
                </li>}
            </ul>
            Please upgrade your membership to increase your purchase limits.
        </div>
);

RankLimitDisplay.propTypes = {
    rank: PropTypes.number,
    memberLimit: PropTypes.instanceOf(AssetLimit),
    platformLimit: PropTypes.instanceOf(GlobalLimit),
    userLimit: PropTypes.instanceOf(AssetLimit),
    resetTime: PropTypes.string,
    hasPeriodStarted: PropTypes.bool
};

export default RankLimitDisplay;
