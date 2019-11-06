import { convertFromSolidityAndFormatForDisplay } from "../../util/helpers";
import { RANK_LEVELS } from "../../core/rankTracking";
import BigNumber from "bignumber.js";

export default class GlobalLimit {

    rank;
    globalLimit;
    displayGlobalLimit;

    userUsage;
    displayUserUsage;

    constructor(rank, globalLimit, userUsage) {
        this.rank = parseInt(rank);
        this.rankText = RANK_LEVELS[rank];

        this.globalLimit = new BigNumber(globalLimit);
        this.displayGlobalLimit = convertFromSolidityAndFormatForDisplay(this.globalLimit, 0);
        this.hasReachedLimit = true;
        this.displayQtyAvailable = 0;

        if(userUsage) {
            this.userUsage = new BigNumber(userUsage);
            this.displayUserUsage = convertFromSolidityAndFormatForDisplay(this.userUsage, 0);

            this.hasReachedLimit = this.userUsage.isGreaterThanOrEqualTo(this.globalLimit);

            this.displayQtyAvailable = this.hasReachedLimit ? 0 : convertFromSolidityAndFormatForDisplay(this.globalLimit.minus(this.userUsage), 0);
        }
    }

    canBuy(solidityQty) {
        return this.userUsage && this.userUsage.plus(solidityQty).isLessThanOrEqualTo(this.globalLimit);
    }

}