import { loadPlatformWeb3Contract, loadContractIntoWeb3 } from "./web3/contracts";
import { callEthereumMethod, sendTransaction } from "./web3/web3Wrapper";
import { convertToSolidityNumber } from "./helpers";

class assetHolder {
    constructor(assetContract) {
        this.assetContract = assetContract;
        this.feeManager = undefined;
        this.assetToken = undefined;
        this.claimer = undefined;
        this.escrowFee = undefined;
        this.msiFee = undefined;
        this.pafFee = undefined;
        this.ptfFee = undefined;
        this.tokenCode = undefined;
        this.assetAgent = undefined;
    }
}

export async function agentCreateAndSetHash(web3, displayName, tokenCode, agent, dataHash) {
    let assetContract = await listAsset(displayName, tokenCode, agent, web3);
    let asset = await retrieveAssetContract(assetContract.address, tokenCode, web3);
    await prepAssetForContractCreation(asset, dataHash, web3);

    console.log('Asset Address', asset.assetContract.address);
}

export async function createTokenFeeManagerAndWhitelist(web3, asset, adminUser, tokenName, assetCostUSD, msiPercent, bitcarPercent, tradingTimeSeconds, votingTimeSeconds, minOwnershipPercentage, numberOfExtensions, escrowPercent, pafPercent, ptfPercent) {

    console.log("Creating token " + tokenName + " - " + asset.tokenCode);

    let assetContract = asset.assetContract;

    let totalTokenSupply = convertToSolidityNumber(assetCostUSD);

    let ownershipPercentage = minOwnershipPercentage ? minOwnershipPercentage : 95;

    let maxCycles = numberOfExtensions ? numberOfExtensions * 2 : 2;

    console.log("Creating Asset token");
    await sendTransaction(false, web3, assetContract.methods.createAssetToken(tokenName, asset.tokenCode, totalTokenSupply.toString(), ownershipPercentage, tradingTimeSeconds, votingTimeSeconds, maxCycles), {from: adminUser});

    let tokenAddress = await callEthereumMethod(assetContract.methods.getTokenAddress(), {});
    let assetToken = loadContractIntoWeb3(tokenAddress, require('../../build/contracts/AssetToken.json'), web3);
    console.log("Token Created", tokenAddress);

    let balance = await callEthereumMethod(assetToken.totalSupply(), {});
    console.log(`Token Supply ${formatNumberForDisplay(balance, false)} with 8 d.p, equates to:`, formatNumberForDisplay(balance, true).toString());

    console.log("Creating asset fees");

    let beePercent = escrowPercent ? escrowPercent : defaultBEEPercent;
    let pafPercentValue = pafPercent ? pafPercent : defaultPAFPercent;
    let ptfPercentValue = ptfPercent ? ptfPercent : defaultPTFPercent;
    let msiPercentValue = msiPercent ? msiPercent : defaultMSIPerYear;

    let bee = Math.round(totalTokenSupply * (beePercent/100));
    let msi = Math.round(totalTokenSupply * (msiPercentValue/100));
    let paf = Math.round(totalTokenSupply * (pafPercentValue/100));
    let ptf = Math.round(totalTokenSupply * (ptfPercentValue/100));

    console.log("Creating Asset fees");
    await sendTransaction(false, web3, assetContract.methods.createFeeManager(), {from:adminUser});
    console.log('asset contract created');
    const feeManagerAddress = await callEthereumMethod(assetContract.methods.getFeeManagerAddress(), {from:adminUser});
    let feeManager = loadContractIntoWeb3(feeManagerAddress, require('../../build/contracts/FeeManager.json'), web3);
    await sendTransaction(false, web3, feeManager.methods.createDefaultFees(bee, msi, paf, ptf), {from:adminUser});

    console.log("MSI Total: $", formatNumberForDisplay(msi, true));
    console.log("BEE (Bitcar Extension Escrow) Total: $", formatNumberForDisplay(bee, true));
    console.log("PAF (Platform Access Fee) Total: $", formatNumberForDisplay(paf, true));
    console.log("PTF (Platform Transaction Fee) Total: $", formatNumberForDisplay(ptf, true));

    console.log("MSI per token: $", formatNumberForDisplay(msi / assetCostUSD, true));
    console.log("BEE per token: $", formatNumberForDisplay(bee / assetCostUSD, true));
    console.log("PAF per token: $", formatNumberForDisplay(paf / assetCostUSD, true));
    console.log("PTF per token: $", formatNumberForDisplay(ptf / assetCostUSD, true));

    let ethPercent = 100 - bitcarPercent;
    console.log(chalk.cyan(`Setting purchase type percentages ETH:${ethPercent}% BITCAR:${bitcarPercent}%`));
    await sendTransaction(false, web3, await assetContract.methods.setPurchasePercentages(bitcarPercent, ethPercent), { from: adminUser });

    console.log('Creating Asset Whitelist...');
    await sendTransaction(false, web3, asset.assetContract.methods.createWhitelist(), {from: approvalAdmin});
    console.log('Whitelist created.');
}

export async function createAssetBallot(asset, minSoldTokensPercentage, defaultMinVotePercentage, defaultVoteRunningPeriod, adminUser) {

    console.log('Creating Asset Ballot....');

    await asset.assetContract.createAssetBallot(minSoldTokensPercentage, defaultMinVotePercentage, defaultVoteRunningPeriod, {from: adminUser});

    const assetControlBallotContractAddress = await asset.assetContract.getAssetControlBallotAddress();
    const assetControlBallot = await getContractAtAddress(AssetControlBallotContract, assetControlBallotContractAddress);

    console.log('Asset Ballot created.');

    return assetControlBallot;
}

async function listAsset(assetName, tokenCode, agentAccount, web3) {
    console.log(chalk.cyan(`\r\n � Registering Asset ${assetName} - ${tokenCode} �`));

    const AssetFactory = loadPlatformWeb3Contract(require('../../build/contracts/AssetFactory.json'));

    let currentSize = await callEthereumMethod(AssetFactory.methods.size(), {from: agentAccount});
    await sendTransaction(false, web3, AssetFactory.methods.create(), {from: agentAccount});

    let assetAddress = await callEthereumMethod(AssetFactory.get(currentSize), {from: agentAccount});
    
    console.log("Retrieved new asset address, now retrieving contract...", assetAddress);
    let asset = loadContractIntoWeb3(assetAddress, require('../../build/contracts/Asset.json'), web3);

    return asset;
}

export async function retrieveAssetContract (assetContractAddress, tokenCode, web3) {

    let assetContract = loadContractIntoWeb3(assetContractAddress, require('../../build/contracts/Asset.json'), web3);

    console.log(`Retrieving asset information for address '${assetAddress}'`);

    let asset = new assetHolder(assetContract);

    asset.assetAgent = await callEthereumMethod(asset.assetContract.methods.agent(), {});
    asset.tokenCode = tokenCode;

    console.log(`Successfully retrieved asset contract '${asset.tokenCode}' agent: '${asset.assetAgent}'`);
    return asset;
}

const prepAssetForContractCreation = async (asset, dataHash, web3) => {
    console.log(`Agent data approval for ${asset.tokenCode}, hash: ${dataHash}`);
    await sendTransaction(false, web3, asset.assetContract.methods.agentApproveData(dataHash, {from: asset.assetAgent}));
}