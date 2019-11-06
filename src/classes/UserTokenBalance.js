import { convertFromSolidityAndFormatForDisplay } from "../util/helpers";

export default class UserTokenBalance {

    hotBalance;
    coldBalance;
    totalBalance;

    constructor(hotBalance, coldBalance) {
        this.hotBalance = hotBalance;
        this.coldBalance = coldBalance;

        this.displayHotBalance = convertFromSolidityAndFormatForDisplay(hotBalance, 0);
        this.displayColdBalance = convertFromSolidityAndFormatForDisplay(coldBalance, 0);

        this.totalBalance = this.hotBalance.plus(this.coldBalance);
    }
}