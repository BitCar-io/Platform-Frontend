import Fees from "classes/Fees";
import BigNumber from "bignumber.js";
import { ReverseRate, USDtoETH, convertToSolidityNumber } from "util/helpers";
import { DISPLAY_DECIMALS_USD } from "util/globalVariables";

const zeroBigNumber = new BigNumber(0);
const blankFees = new Fees(zeroBigNumber, zeroBigNumber, zeroBigNumber, zeroBigNumber, zeroBigNumber, zeroBigNumber, zeroBigNumber, zeroBigNumber, false);

describe("Creating fees with all arguments as 0", () => {
  it("should create a Fees object", () => {
    expect(blankFees).not.toBe(undefined);
  });
  it("should have a tokenQty of 0", () => {
    expect(blankFees.tokenQty).toEqual(zeroBigNumber);
  });
  it("should have a BEE of 0", () => {
    expect(blankFees.BEE).toEqual(zeroBigNumber);
  });
  it("should have a PAF of 0", () => {
    expect(blankFees.PAF).toEqual(zeroBigNumber);
  });
  it("should have a displayTotalEthereum of 0.000000", () => {
    expect(blankFees.displayTotalEthereum).toBe("0.000000");
  });
  it("should have a totalUsd_display of 0.00", () => {
    expect(blankFees.totalUsd_display).toBe("0.00");
  });
  it("should have a bitCarTotalInUSD of 0.00", () => {
    expect(blankFees.bitCarTotalInUSD).toBe("0.00");
  });
  it("should have a totalEthInUSD of 0.00", () => {
    expect(blankFees.totalEthInUSD).toBe("0.00");
  });
});

describe("Creating fees with tokenQty of 50 and 20/80 BTC/ETH split", () => {
  const tokenQty = new BigNumber(50);
  const pafPerToken = new BigNumber(0.002);
  const escrowPerToken = new BigNumber(0.1);
  const ptfPerToken = new BigNumber(0);
  const bitcarUSD = new BigNumber(0.005);
  const ethUSD = new BigNumber(212.1);
  const tokenBitCarPercent = new BigNumber(0.2);
  const tokenEthereumPercent = new BigNumber(0.8);
  const requiresEth = true;

  const twentyEightyFees = new Fees(tokenQty, pafPerToken, escrowPerToken, ptfPerToken, bitcarUSD, ethUSD, tokenBitCarPercent, tokenEthereumPercent, requiresEth);

  it("should have a tokenQty of 50", () => {
    expect(twentyEightyFees.tokenQty).toEqual(new BigNumber(50));
  });
  it("should have a BEEinUSD of 5.00", () => {
    expect(twentyEightyFees.displayBEEinUSD).toBe("5.00");
  });
  it("should have a PAFinUSD of 0.10", () => {
    expect(twentyEightyFees.displayPAFinUSD).toBe("0.10");
  });
  it("should have a displayBEE of 1,000.000", () => {
    expect(twentyEightyFees.displayBEE).toBe("1,000.000");
  });
  it("should have a displayPAF of 20.000", () => {
    expect(twentyEightyFees.displayPAF).toBe("20.000");
  });
  it("should have a totalEthereum of 18859028.76001885904", () => {
    expect(twentyEightyFees.totalEthereum).toEqual(new BigNumber('18859028.76001885904'));
  });
  it("should have a displayTotalEthereum of 0.188590", () => {
    expect(twentyEightyFees.displayTotalEthereum).toBe("0.188590");
  });
  it("should have a totalUsd_display of 55.10", () => {
    expect(twentyEightyFees.totalUsd_display).toBe("55.10");
  });
  it("should have a bitCarTotalInUSD of 15.10", () => {
    expect(twentyEightyFees.bitCarTotalInUSD).toEqual(new BigNumber(15.1).toFormat(DISPLAY_DECIMALS_USD));
  });
  it("should have a totalEthInUSD of 40.00", () => {
    expect(twentyEightyFees.totalEthInUSD).toEqual(new BigNumber(40.00).toFormat(DISPLAY_DECIMALS_USD));
  });
  it("should have a totalEthInUSD of 40.00", () => {
    expect(twentyEightyFees.totalEthInUSD).toEqual(new BigNumber(40.00).toFormat(DISPLAY_DECIMALS_USD));
  });
  it("should have a PTFinUSD of 0.00", () => {
    expect(twentyEightyFees.displayPTFinUSD).toEqual("0.00");
  });
  it("should have a displayPTF of 0.000", () => {
    expect(twentyEightyFees.displayPTF).toBe("0.000");
  });
});

describe("Creating fees with tokenQty of 50 and 100/00 BTC/ETH split", () => {

  const tokenQty = new BigNumber(50);
  const pafPerToken = new BigNumber(0.02);
  const escrowPerToken = new BigNumber(0.1);
  const ptfPerToken = new BigNumber(0.002);
  const bitcarUSD = new BigNumber(0.005);
  const ethUSD = new BigNumber(212.1);
  const tokenBitCarPercent = new BigNumber(1);
  const tokenEthereumPercent = new BigNumber(0);
  const requiresEth = false;

  const hundredPercentBitcarFees = new Fees(tokenQty, pafPerToken, escrowPerToken, ptfPerToken, bitcarUSD, ethUSD, tokenBitCarPercent, tokenEthereumPercent, requiresEth);

  it("should have a tokenQty of 50", () => {
    expect(hundredPercentBitcarFees.tokenQty).toEqual(new BigNumber(50));
  });
  it("should have a displayTokenBitCarCost of 10,000.000", () => {
    expect(hundredPercentBitcarFees.displayTokenBitCarCost).toBe("10,000.000");
  });
  it("should have totalEthereum of 0", () => {
    expect(hundredPercentBitcarFees.totalEthereum).toEqual(new BigNumber(0));
  });
  it("should have a totalEthInUSD of 0.00", () => {
    expect(hundredPercentBitcarFees.totalEthInUSD).toBe("0.00");
  });
});
