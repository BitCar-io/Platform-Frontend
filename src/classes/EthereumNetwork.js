export default class EthereumNetwork {

    id;
    shortName;
    longName
    scanUrl;

    constructor(id, shortName, longName, scanUrl) {
        this.id = id;
        this.shortName = shortName;
        this.longName = longName;
        this.scanUrl = scanUrl;
    }
}