import BigNumber from "bignumber.js";

export default class AssetControlBallotContractData {

    assetControlBallotContract;

    voteCancellationCost;
    voteCastCost;
    voteCreationCost;
    
    constructor(assetControlBallotContract, voteCreationCost, voteCastCost, voteCancellationCost) {
        this.assetControlBallotContract = assetControlBallotContract;
        this.voteCreationCost = new BigNumber(voteCreationCost);
        this.voteCastCost = new BigNumber(voteCastCost);
        this.voteCancellationCost = new BigNumber(voteCancellationCost);
    }
}