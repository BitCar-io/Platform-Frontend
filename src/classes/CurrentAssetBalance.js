import { convertFromSolidityNumber, convertFromSolidityAndFormatForDisplay } from '../util/helpers';
import { DISPLAY_DECIMALS_QUANTITY_SOLD } from '../util/globalVariables';
import BigNumber from 'bignumber.js';

function getCurrentAssetBalance(totalTokenSupply, platformBalance) {
    let qtySold = totalTokenSupply.minus(platformBalance);
    let percentRemaining = platformBalance.dividedBy(totalTokenSupply).multipliedBy(100); 
    return {percentRemaining: percentRemaining, qtySold: qtySold, qtySoldDisplay: convertFromSolidityAndFormatForDisplay(qtySold, DISPLAY_DECIMALS_QUANTITY_SOLD)};
}

export default class CurrentAssetBalance {

    address;
    escrowAmountDisplay;
    escrowAmountNumber;
    percentRemaining;
    percentUsed;
    qtySold;
    qtySoldDisplay;
    qtyRemaining;
    qtyRemainingDisplay;
    totalTokenSupply;
    totalTokenSupplyDisplay;

    constructor(address, totalTokenSupply, escrowBalance, platformBalance) {

        this.validateParameter('totalTokenSupply', totalTokenSupply);
        this.validateParameter('escrowBalance', escrowBalance);
        this.validateParameter('platformBalance', platformBalance);

        this.address = address;
        this.totalTokenSupply = totalTokenSupply;
        this.totalTokenSupplyDisplay = convertFromSolidityAndFormatForDisplay(totalTokenSupply, 0);

        let balances = getCurrentAssetBalance(totalTokenSupply, platformBalance);
        this.qtySold = balances.qtySold;
        this.qtySoldDisplay = balances.qtySoldDisplay;
        this.qtyRemaining = this.totalTokenSupply.minus(this.qtySold);
        this.qtyRemainingDisplay = convertFromSolidityAndFormatForDisplay(this.qtyRemaining, 0);
        this.percentRemaining = balances.percentRemaining.toFormat(0);
        this.percentUsed = balances.percentRemaining.plus(-100).absoluteValue().toNumber();

        this.escrowAmountNumber = convertFromSolidityNumber(escrowBalance);
        this.escrowAmountDisplay = this.escrowAmountNumber.toFormat(0);
    }

    validateParameter = (parameterName, parameterValue) => {
        if(!parameterValue || !BigNumber.isBigNumber(parameterValue)) {
            throw new Error(`CurrentAssetBalance constructor expects a BigNumber object for parameter '${parameterName}'`);
        }
    }
}