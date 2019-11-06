import BigNumber from "bignumber.js";

export default class ChangeRequest {

    changeRequestEvent;
    portfolioAsset;
    voteHasExpired;

    blockNumber;
    status;
    userHasVoted;

    category;
    creationTime;
    creator;
    minVotes;
    numVotes;
    voteID;

    isValidChangeRequestObject = false;

    constructor(changeRequestEvent, portfolioAsset) {
        this.changeRequestEvent = changeRequestEvent;
        this.portfolioAsset = portfolioAsset;

        if(!changeRequestEvent) {
            return;
        }

        this.blockNumber = changeRequestEvent.blockNumber;
        this.status = changeRequestEvent.status;
        this.userHasVoted = changeRequestEvent.userHasVoted;

        if(!changeRequestEvent.returnValues) {
            return;
        }

        this.category = changeRequestEvent.returnValues._category;
        this.creationTime = new Date(parseInt(changeRequestEvent.returnValues._creationTime));
        this.creator = changeRequestEvent.returnValues._creator;
        this.minVotes = new BigNumber(changeRequestEvent.returnValues._minVotes);
        this.numVotes = new BigNumber(changeRequestEvent.returnValues._numVotes);
        this.voteID = changeRequestEvent.returnValues._voteID;

        this.isValidChangeRequestObject = true;
    }

    setVoteHasExpired(value) {
        this.voteHasExpired = value;
    }
}