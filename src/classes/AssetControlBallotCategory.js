import BigNumber from "bignumber.js";

export default class AssetControlBallotCategory {

    index;

    minVotePercentage;
    title;
    exists;
    
    constructor(index, minVotePercentage, title, exists) {
        this.index = index;
        this.minVotePercentage = new BigNumber(minVotePercentage);
        this.title = title;
        this.exists = exists;
    }
}