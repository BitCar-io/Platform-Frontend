const ipfsClient = require("ipfs-http-client");
const fs = require('fs');

// TODO: Clean the way branch is being passed
require('./load-env-config.js').loadConfig(process.argv.slice(2)[0]);

if(!fs.existsSync(process.env.DIST_PATH)) {
    throw new Error(`Unable to find ${process.env.DIST_PATH}`);
}

const ipfs = new ipfsClient({ host: process.env.REACT_APP_IPFS_API_HOST, port: process.env.REACT_APP_IPFS_API_PORT, protocol: process.env.REACT_APP_IPFS_API_PROTOCOL });

ipfs.addFromFs(process.env.DIST_PATH, {recursive: true, pin: true}, (err, hashes) => {
    if(err) {
        throw new Error("Failed to add to IPFS " + err);
    }
    const distHash = hashes[hashes.length-1]["hash"];

    ipfs.pin.add(distHash, (err, pinset) => {
        if(err) {
            throw new Error("Failed to add to IPFS " + err);
        }

        console.log("Added all files to IPFS");
        console.log("The platform can be browsed at", `${process.env.REACT_APP_IPFS_READ_BASE_URL}/ipfs/${distHash}`);
    });
});