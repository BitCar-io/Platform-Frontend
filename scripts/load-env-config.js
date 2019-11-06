const fs = require('fs');

function loadConfig(environment) {
    if(!environment) {
        throw new Error("Invalid environment name");
    }

    const configPath = `./config/.env.${environment}`;
    
    if (!fs.existsSync(configPath)) {
        throw new Error(`Unable to load configuration file for environment ${environment}`);
    }
    
    require('dotenv').config({ path: `./config/.env.${environment}` });
}

module.exports = {
    loadConfig
}