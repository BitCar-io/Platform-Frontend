import { convertToSolidityNumber, USDtoBitcar, USDtoETH, ETHtoUSD, bitcarToUSD, convertFromSolidityAndFormatForDisplay } from '../util/helpers';
import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS_USD, DISPLAY_DECIMALS_BITCAR, DISPLAY_DECIMALS_ETH } from '../util/globalVariables';

export default class Fees {

    tokenQty:BigNumber;
    BEE:BigNumber;
    PAF:BigNumber;
    PTF:BigNumber;
    totalBEEinUSD:BigNumber;
    displayBEEinUSD:string;
    displayPAFinUSD:string;
    displayPTFinUSD:string;
    tokenBitCarCost:BigNumber;
    totalEthereum:BigNumber;
    totalBitCar:BigNumber;

    displayBEE:string;
    displayPAF:string;
    displayPTF:string;
    displayTokenBitCarCost:string;
    displayTotalEthereum:string = '0';
    displayTotalBitCar:string;
    totalUsd:BigNumber;
    totalUsd_display:string;
    bitCarTotalInUSD:string;
    totalEthInUSD:string;
    totalFeesInUSD:string;

    tokenBitCarPercent: BigNumber;
    tokenEthereumPercent: BigNumber;

    constructor(tokenQty:BigNumber, pafPerToken:BigNumber, escrowPerToken:BigNumber, ptfPerToken:BigNumber, bitcarUSD:BigNumber, ethUSD:BigNumber, tokenBitCarPercent:BigNumber, tokenEthereumPercent:BigNumber, requiresEth:boolean) {

        this.tokenQty = tokenQty.isGreaterThan(0) ? tokenQty : new BigNumber(0);
        this.tokenBitCarPercent = tokenBitCarPercent;
        this.tokenEthereumPercent = tokenEthereumPercent;

        const totalPurchaseEscrow = escrowPerToken.multipliedBy(this.tokenQty);
        const totalPurchasePaf = pafPerToken.multipliedBy(this.tokenQty);
        const totalPurchasePTF = ptfPerToken.multipliedBy(this.tokenQty);

        if(bitcarUSD.isGreaterThan(0)) {
            this.BEE = USDtoBitcar(totalPurchaseEscrow, bitcarUSD);
            this.PAF = USDtoBitcar(totalPurchasePaf, bitcarUSD);
            this.PTF = USDtoBitcar(totalPurchasePTF, bitcarUSD);
        } else {
            this.BEE = new BigNumber(0);
            this.PAF = new BigNumber(0);
            this.PTF = new BigNumber(0);
        }

        this.totalFeesInUSD = totalPurchaseEscrow.plus(totalPurchasePaf).plus(totalPurchasePTF).toFormat(DISPLAY_DECIMALS_USD);
        this.totalBEEinUSD = totalPurchaseEscrow;
        this.displayBEEinUSD = totalPurchaseEscrow.toFormat(DISPLAY_DECIMALS_USD);
        this.displayPAFinUSD = totalPurchasePaf.toFormat(DISPLAY_DECIMALS_USD);
        this.displayPTFinUSD = totalPurchasePTF.toFormat(DISPLAY_DECIMALS_USD);

        this.tokenBitCarCost = new BigNumber(0);
        this.totalUsd = new BigNumber(0);

        if (tokenQty.isGreaterThan(0)) {
            this.tokenBitCarCost = USDtoBitcar(convertToSolidityNumber(this.tokenQty.multipliedBy(tokenBitCarPercent)), bitcarUSD);
            this.totalUsd = this.tokenQty.plus(totalPurchaseEscrow).plus(totalPurchasePaf).plus(totalPurchasePTF);
        }
        this.totalEthereum = new BigNumber(0);
        if (requiresEth && tokenQty.isGreaterThan(0)) {
            this.totalEthereum = USDtoETH(convertToSolidityNumber(this.tokenQty.multipliedBy(tokenEthereumPercent)), ethUSD);
        }

        this.totalUsd_display = this.totalUsd.toFormat(DISPLAY_DECIMALS_USD);
        this.totalBitCar = convertToSolidityNumber(this.BEE.plus(this.PAF).plus(this.PTF)).plus(this.tokenBitCarCost);

        this.displayBEE = this.BEE.toFormat(DISPLAY_DECIMALS_BITCAR);
        this.displayPAF = this.PAF.toFormat(DISPLAY_DECIMALS_BITCAR);
        this.displayPTF = this.PTF.toFormat(DISPLAY_DECIMALS_BITCAR);
        this.displayTokenBitCarCost = convertFromSolidityAndFormatForDisplay(this.tokenBitCarCost, DISPLAY_DECIMALS_BITCAR);
        this.displayTotalEthereum = convertFromSolidityAndFormatForDisplay(this.totalEthereum, DISPLAY_DECIMALS_ETH);
        
        this.displayTotalBitCar = convertFromSolidityAndFormatForDisplay(this.totalBitCar, DISPLAY_DECIMALS_BITCAR);
        this.bitCarTotalInUSD = convertFromSolidityAndFormatForDisplay(bitcarToUSD(this.totalBitCar, bitcarUSD), DISPLAY_DECIMALS_USD);
        this.totalEthInUSD = convertFromSolidityAndFormatForDisplay(ETHtoUSD(this.totalEthereum, ethUSD), DISPLAY_DECIMALS_USD);
    }

    getBitCarExRate () {
        return new BigNumber(1).dividedBy(this.tokenBitCarCost.dividedBy(this.tokenQty.multipliedBy(this.tokenBitCarPercent)));
    }

    getEthExRate () {
        let usdEth = new BigNumber(0);
            
        if(this.totalEthereum.isGreaterThan(0)) {
            usdEth = new BigNumber(1).dividedBy(new BigNumber(convertToSolidityNumber(this.totalEthereum)).dividedBy(this.tokenQty.multipliedBy(this.tokenEthereumPercent)));
        }

        return usdEth;
    }
}