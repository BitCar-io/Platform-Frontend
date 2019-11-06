import { assetApprovalState } from '../util/assetHelpers';
import BigNumber from 'bignumber.js';
import { convertFromSolidityNumber } from '../util/helpers';

export default class BaseAssetData {

    // variables from constructor
    adminRejectionCount;
    address;
    agent;
    agentRejectionCount;
    approvalState;
    assetContract;
    dataHash;
    minPurchaseAmount;
    minPurchaseAmountNumber;
    
    // ui variables
    isLive;

    constructor(assetContract, agent, approvalState, dataHash, adminRejectionCount, agentRejectionCount, minPurchaseAmount) {
        
        this.assetContract = assetContract;
        this.address = assetContract.address;
       
        this.dataHash = dataHash;
        this.agent = agent;
        
        this.approvalState = approvalState;
        this.isLive = (approvalState === assetApprovalState.LIVE);

        this.agentRejectionCount = agentRejectionCount;
        this.adminRejectionCount = adminRejectionCount;

        this.minPurchaseAmount = new BigNumber(minPurchaseAmount);
        this.minPurchaseAmountNumber = convertFromSolidityNumber(this.minPurchaseAmount);
    }
}
