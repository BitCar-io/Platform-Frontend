function configureVariables(branch) {
    let branchToUse = "local";

    if(branch) {
        branchToUse = branch.toLowerCase().trim();
    }

    console.log(`Configuring environment variables for branch deployment '${branchToUse}'`);

    const baseUrl = `platform.bitcar.io`;
    const nonProductionUrl = `${branchToUse}-${baseUrl}`;
    const baseKycApiUrl = "/bitcarapi/v1/kyc/uploadDocument";
    const kycEnvironmentUrl = `https://kyc${branchToUse === 'mainnet' ? '' : `-${branchToUse}`}.bitcar.io`;

    const mainnetInfuraProjectId = 'API_KEY';
    const testnetInfuraProjectId = 'API_KEY';

    switch(branchToUse) {
        case "mainnet": {
            const environmentIp = "192.168.1.122";
            process.env.DEPLOY_TICKER_ADDRESS=`http://${environmentIp}:8082`;
            process.env.REACT_APP_IPFS_READ_BASE_URL=`https://${baseUrl}`;
            process.env.REACT_APP_IPFS_API_HOST=environmentIp;
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK=1;
            process.env.REACT_APP_WEB3_WS_FALLBACK=`wss://mainnet.infura.io/ws/v3/${mainnetInfuraProjectId}`;
            process.env.REACT_APP_WEB3_HTTP_FALLBACK=`https://mainnet.infura.io/v3/${mainnetInfuraProjectId}`;
            break;
        }
        case "rinkeby": {
            const environmentIp = "192.168.1.120";
            process.env.DEPLOY_TICKER_ADDRESS=`http://${environmentIp}:8082`;
            process.env.REACT_APP_IPFS_READ_BASE_URL=`https://${nonProductionUrl}`;
            process.env.REACT_APP_IPFS_API_HOST=environmentIp;
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK=3;
            process.env.REACT_APP_WEB3_WS_FALLBACK=`wss://${branchToUse}.infura.io/ws/v3/${testnetInfuraProjectId}`;
            process.env.REACT_APP_WEB3_HTTP_FALLBACK=`https://${branchToUse}.infura.io/v3/${testnetInfuraProjectId}`;
            break;
        }
        case "ropsten": {
            const environmentIp = "192.168.1.120";
            process.env.DEPLOY_TICKER_ADDRESS=`http://${environmentIp}:8082`;
            process.env.REACT_APP_IPFS_READ_BASE_URL=`https://${nonProductionUrl}`;
            process.env.REACT_APP_IPFS_API_HOST=environmentIp;
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK=3;
            process.env.REACT_APP_WEB3_WS_FALLBACK=`wss://${branchToUse}.infura.io/ws/v3/${testnetInfuraProjectId}`;
            process.env.REACT_APP_WEB3_HTTP_FALLBACK=`https://${branchToUse}.infura.io/v3/${testnetInfuraProjectId}`;
            break;
        }
        case "staging": {
            const environmentIp = "192.168.1.118";
            process.env.DEPLOY_TICKER_ADDRESS=`http://${environmentIp}:8082`;
            process.env.REACT_APP_IPFS_READ_BASE_URL=`https://${nonProductionUrl}`;
            process.env.REACT_APP_IPFS_API_HOST=environmentIp;
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK=7200;
            process.env.REACT_APP_WEB3_WS_FALLBACK=`ws://${environmentIp}:8546`;
            process.env.REACT_APP_WEB3_HTTP_FALLBACK=`http://${environmentIp}:8545`;
            break;
        }
        case "development": {
            const environmentIp = "192.168.1.119";
            process.env.DEPLOY_TICKER_ADDRESS=`http://${environmentIp}:8082`;
            process.env.REACT_APP_IPFS_READ_BASE_URL=`https://${nonProductionUrl}`;
            process.env.REACT_APP_IPFS_API_HOST=environmentIp;
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK=7200;
            process.env.REACT_APP_WEB3_WS_FALLBACK=`ws://${environmentIp}:8546`;
            process.env.REACT_APP_WEB3_HTTP_FALLBACK=`http://${environmentIp}:8545`;
            break;
        }
        default: {
            console.warn("Expected 1 argument specifying a valid branch to deploy - we will assume a local build so setting build as 'local' as value provided was:", branch);
            process.env.REACT_APP_IPFS_API_HOST="192.168.1.119";
            process.env.REACT_APP_IPFS_API_PROTOCOL="http";
            process.env.REACT_APP_IPFS_API_PORT=5001
            process.env.REACT_APP_KYC_API_READ_BASE_URL=`${kycEnvironmentUrl}${baseKycApiUrl}`
            process.env.REACT_APP_ETHNETWORK="ANY";
            break;
        }
    }
}

module.exports = {
    configureVariables
}