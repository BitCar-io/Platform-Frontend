import BigNumber from 'bignumber.js';

import BaseAssetData from 'classes/BaseAssetData';
import LoadedAsset from 'classes/LoadedAsset';
import FeeManagerData from 'classes/FeeManagerData';
import WhitelistContractData from 'classes/WhitelistContractData';
import TokenContractData from 'classes/TokenContractData';

const baseAsset = new BaseAssetData({address: '0x012345'}, 'testAgent', 3, 'test_hash', 0, 0, 50);
const ipfsData = {
  data: {
    newPrice: 100000
  }
}
const assetTokenData = new TokenContractData(
  { address: "0x012345" },  // assetTokenContract
  'TEST123',                // tokenCode
  50000000000000,           // totalTokenSupply
  94608000,                 // tradingPeriodDuration
  604800,                   // votingPeriodDuration
  1548310557                // approvalDateInSeconds
);
const feeManagerData = new FeeManagerData({address: "0x012345"}, {address: "0x0123456"}, 5, 5, 5);
const whitelistData = new WhitelistContractData({address: "0x012345"}, true, true, false, false, [ 'AUS', 'SGP']);

const loadedAsset = new LoadedAsset(baseAsset, ipfsData, 20, assetTokenData, feeManagerData, whitelistData);

describe("Creating LoadedAsset", () => {
  it("should create a LoadedAsset object", () => {
    expect(loadedAsset).not.toBe(undefined);
  });
  it("should have a tokenBitCarPercent of 0.2", () => {
    expect(loadedAsset.tokenBitCarPercent).toEqual(new BigNumber(0.2));
  });
  it("should have a tokenEthereumPercent of 0.8", () => {
    expect(loadedAsset.tokenEthereumPercent).toEqual(new BigNumber(0.8));
  });
  it("should have a require Eth", () => {
    expect(loadedAsset.requiresEth).toBe(true);
  });
  it("should have a require Eth", () => {
    expect(loadedAsset.requiresEth).toBe(true);
  });
});