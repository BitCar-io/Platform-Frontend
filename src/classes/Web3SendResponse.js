export default class Web3SendResponse {
    constructor(receipt, errors) {
        this.receipt = receipt;
        this.status = receipt && receipt.status;
        this.errors = errors;
        this.hasErrored = (errors !== null && errors !== undefined && errors.length > 0) || this.status === false;
    }
}