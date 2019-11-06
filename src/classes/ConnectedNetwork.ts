export default class ConnectedNetwork {

    networkDetails:any;
    networkId:number;
    networkName:string;
    isSupported:boolean;

    allowedNetworkIds:string;
    allowedNetworkNames:string;

    constructor(networkDetails:any, allowedNetworkIds:Array<number>, allowedNetworkNames:string) {
        this.networkDetails = networkDetails;
        this.networkId = networkDetails.id;
        this.networkName = networkDetails.longName;
        this.isSupported = (allowedNetworkIds && this.networkId && allowedNetworkIds.includes(this.networkId)) === true;

        this.allowedNetworkIds = allowedNetworkIds.join(',');
        this.allowedNetworkNames = allowedNetworkNames;
    }
}