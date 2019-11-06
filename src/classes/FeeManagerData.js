import BigNumber from "bignumber.js";

export default class FeeManagerData {

    feeManagerContract;
    beeContract;
    totalEscrow;
    totalMSI;
    totalPAF;
    totalPTF;

    constructor(feeManagerContract, beeContract, totalEscrow, totalMSI, totalPAF, totalPTF) {
        this.feeManagerContract = feeManagerContract;
        this.beeContract = beeContract;
        this.totalEscrow = new BigNumber(totalEscrow);
        this.totalMSI = new BigNumber(totalMSI);
        this.totalPAF = new BigNumber(totalPAF);
        this.totalPTF = new BigNumber(totalPTF);
    }
}