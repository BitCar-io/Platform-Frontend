import { RANK_LEVELS } from "../../core/rankTracking";
import BigNumber from "bignumber.js";
import moment from "moment";
import { convertFromSolidityAndFormatForDisplay } from "../../util/helpers";

export default class AssetLimit {

    rank;
    rankText;
    period;
    periodLimit;
    periodUsage;
    lastUpdate;

    hasPeriodStarted;
    momentOfLastUpdate;
    momentOfReset;

    displayPeriodInHours;
    displayPeriodLimit;
    displayPeriodUsage;
    displayQtyAvailable;

    constructor(rank, period, periodLimit, periodUsage, lastUpdate) {
        this.rank = parseInt(rank);
        this.rankText = RANK_LEVELS[rank];

        this.period = new BigNumber(period);
        this.periodLimit = new BigNumber(periodLimit);
        this.periodUsage = new BigNumber(periodUsage);
        this.lastUpdate = new BigNumber(lastUpdate);

        this.hasReachedLimit = this.periodUsage.isGreaterThanOrEqualTo(this.periodLimit);

        this.displayQtyAvailable = this.hasReachedLimit ? 0 : convertFromSolidityAndFormatForDisplay(this.periodLimit.minus(this.periodUsage), 0);
        
        this.displayPeriodInHours = Math.floor(moment.duration(this.period.toNumber(),'seconds').asHours()).toString();

        this.hasPeriodStarted = false;

        if(this.lastUpdate.isGreaterThan(0)) {
            this.momentOfLastUpdate = moment.utc(new Date(this.lastUpdate * 1000));
            this.momentOfReset = moment.utc(this.momentOfLastUpdate).add(this.period.toNumber(), 'seconds');
            this.hasPeriodStarted = true;
        }

        this.displayPeriodLimit = convertFromSolidityAndFormatForDisplay(this.periodLimit, 0);
        this.displayPeriodUsage = convertFromSolidityAndFormatForDisplay(this.periodUsage, 0);
    }

    canBuy = (solidityQty) => {
        return this.periodUsage.plus(solidityQty).isLessThanOrEqualTo(this.periodLimit);
    }

    getTimeToReset = () => {

        if(!this.hasPeriodStarted) {
            return "now";
        }

        const ms = moment.utc(this.momentOfReset).diff(moment.utc(new Date()));
        const duration = moment.duration(ms);
        const hours = duration.get("hours");
        const minutes = duration.get("minutes");

        return (hours > 0 ? `${hours} hours` : "") + (minutes > 0 ? `${hours > 0 ? ", " : ""}${minutes} minutes` : "");
    }
}
