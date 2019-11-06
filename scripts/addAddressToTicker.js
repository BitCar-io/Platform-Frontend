const fs = require('fs');
const http = require('http');
const path = require('path');
const buildConfig = require('./configureEnvironmentVariables');

const args = process.argv.slice(2);

if(args.length !== 3) {
	console.warn("Expected 3 arguments - 1: The Id of the build. 2: The file for IPFS deployment info. 3: the current branch.");
}

const tickerJsonPath = path.resolve(path.join(__dirname, "../build/contracts/Ticker.json"));
console.log(tickerJsonPath);

const buildId = args[0];
const ipfsFile = args[1];
const branch = args[2].toLowerCase().trim();

buildConfig.configureVariables(branch);

let rawData = fs.readFileSync(tickerJsonPath);
const ticker = JSON.parse(rawData);

const tickerDeployedTo = ticker.networks;

console.log("Networks Available:", tickerDeployedTo);

const keys = Object.keys(tickerDeployedTo);

if(!keys) {
    console.error("Could not locate Ticker deployments within the Ticker.json file.");
	return;
}

const firstKey = keys[0];

const tickerDeployment = tickerDeployedTo[firstKey];

console.log(`Using Network ${firstKey}`, tickerDeployedTo[firstKey]);

let ipfsHash=undefined;

try {

	rawData = fs.readFileSync(ipfsFile);
	const ipfsData = JSON.parse(rawData);
	ipfsHash = ipfsData.hash;
} catch (err) {
	console.warn("Error retrieving ipfsdata from file.", err);
}

http.get(`${process.env.DEPLOY_TICKER_ADDRESS}/addTicker?address=${tickerDeployment.address}&buildId=${buildId}&ipfs=ipfsHash`, response => {
	console.log("Status Response Code:", response.statusCode);
}).on("error", (err) => {
        console.error("Failed to send ticker add request to ticker server.", err);
        console.log("Ticker Address:", tickerDeployment.address);
}).on("end", function () {
	console.log("Request sent successfully."); 
	
});
