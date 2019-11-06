const Minio = require("minio");

const requiredContracts = ["Admin", "Agent", "Sudo", "Trader",
    "Asset", "AssetBallot", "AssetControlBallot", "AssetFactory", "AssetRankTracker", "AssetToken", "AssetTokenFactory", "AssetWhitelist", "AssetWhitelistFactory", "Whitelist",
    "Claimer", "BEE", "FeeManager", "FeeManagerFactory",
    "KycProcessData", "KycProcessTracker", "PlatformToken", "RankTracker", "Registry", "Ticker",
    "Redeem"];

function isValidValue(environment) {
    return !(!environment || environment.trim().length === 0);
}

const args = process.argv.slice(2);
let environment = process.env.CI_COMMIT_REF_NAME;

if(!isValidValue(environment) && args.length === 0) {
    throw new Error("Expected at least a value in environment variable 'CI_COMMIT_REF_NAME' or 1 argument specifying the environment being deployed as non-empty string. TERMINATING.");
} else if(!isValidValue(environment)) {
    environment = args[0].toLowerCase().trim();
    console.log(`Using environment '${environment}' from argument passed in as CI_COMMIT_REF_NAME environment variable is not valid.`);
} else {
    console.log(`Using environment '${environment}' from CI_COMMIT_REF_NAME environment variable`);
}

if(!isValidValue(environment)) {
    throw new Error("Expected at least a value in environment variable 'CI_COMMIT_REF_NAME' or 1 argument specifying the environment being deployed as non-empty string. TERMINATING.");
}

// TODO: Clean the way branch is being passed
require('./load-env-config.js').loadConfig(environment);

const minioClient = new Minio.Client({
    endPoint:  process.env.BUCKET_HOST,
    port:  parseInt(process.env.BUCKET_PORT),
    useSSL: false,
    accessKey: process.env.BUCKET_ACCESSKEY,
    secretKey: process.env.BUCKET_SECRETKEY
});

const bucketPaths = [`platform/backend/${environment}/contracts/`,`redeem/backend/${environment}/contracts/`];
const savePath = "./build/contracts/";

minioClient.bucketExists(process.env.BUCKET_NAME, function(err, exists) {
    if (err) {
        return console.error(err)
    }
});

let skippedContracts = [];

let retrievedBucketCount = 0;

var stream = minioClient.listObjectsV2(process.env.BUCKET_NAME,'', true,'');
stream.on('data', function(obj) {
    const path = obj["name"];

    bucketPaths.forEach(bucketPath => {

        if(path.includes(bucketPath)) {

            retrievedBucketCount = retrievedBucketCount + 1;
            
            const contractName = path.replace(bucketPath, "").replace(".json", "");

            if(!requiredContracts.includes(contractName)) {
                skippedContracts.push(contractName);
                return;
            }
            
            let fullSavePath = savePath + path.replace(bucketPath, "");
            minioClient.fGetObject(process.env.BUCKET_NAME, path, fullSavePath, function(err) {
                if (err) {
                    return console.error(err)
                }

                console.log(`Got contract from ${bucketPath} \t ${fullSavePath}`);
            })
        }
    });
});
stream.on('error', function(err) { console.log(err) } );
stream.on('end', function() {
    
    if(retrievedBucketCount === 0) {
        return console.error(`No bucket paths found for environment '${environment}'`);
    }
    
    if(skippedContracts.length === 0) {
        console.log("Frontend requires all contracts in bucket - none skipped (change this in scripts/get-latest-contracts-bucket.js if required).")
        return;
    }

    console.log('Skipped the following contracts as they were not required by the frontend - change this in scripts/get-latest-contracts-bucket.js if required.')
    skippedContracts.forEach(skippedContract => {
        console.log('\t', skippedContract);
    })
    console.log('Skipped the above contracts as they were not required by the frontend - change this in scripts/get-latest-contracts-bucket.js if required.');
});
