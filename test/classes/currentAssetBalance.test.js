import CurrentAssetBalance from "classes/CurrentAssetBalance";
import BigNumber from "bignumber.js";

const hundredPercentSoldBalance = new CurrentAssetBalance(
  "0xB62Cc66547Cf88765f7822B4bbB1ba9B27407aAf",
  new BigNumber(500000).shiftedBy(8),
  new BigNumber(80000).shiftedBy(8),
  new BigNumber(0)
);

const twentyPercentSoldBalance = new CurrentAssetBalance(
  "0xB62Cc66547Cf88765f7822B4bbB1ba9B27407aAf",
  new BigNumber(500000).shiftedBy(8),
  new BigNumber(80000).shiftedBy(8),
  new BigNumber(400000).shiftedBy(8)
);

describe("Creating a completely sold currentAssetBalance", () => {
  it("should create a CurrentAssetBalance object", () => {
    expect(hundredPercentSoldBalance).not.toBe(undefined);
  });
  it("should have an address of 0xB62Cc66547Cf88765f7822B4bbB1ba9B27407aAf", () => {
    expect(hundredPercentSoldBalance.address).toBe(
      "0xB62Cc66547Cf88765f7822B4bbB1ba9B27407aAf"
    );
  });
  it("should have a totalTokenSupplyDisplay of 500,000", () => {
    expect(hundredPercentSoldBalance.totalTokenSupplyDisplay).toEqual("500,000");
  });
  it("should have a qtyRemaining of 0", () => {
    expect(hundredPercentSoldBalance.qtyRemaining).toEqual(new BigNumber(0));
  });
  it("should have a percentUsed of 100", () => {
    expect(hundredPercentSoldBalance.percentUsed).toEqual(100);
  });
});

describe("Creating a currentAssetBalance", () => {
  it("should have a qtyRemaining of 40000000000000", () => {
    expect(twentyPercentSoldBalance.qtyRemaining).toEqual(new BigNumber(40000000000000));
  });
  it("should have a percentRemaining of 80", () => {
    expect(twentyPercentSoldBalance.percentRemaining).toEqual('80');
  });
  it("should have a percentUsed of 20", () => {
    expect(twentyPercentSoldBalance.percentUsed).toEqual(20);
  });
  it("should have a qtyRemainingDisplay of 400,000", () => {
    expect(twentyPercentSoldBalance.qtyRemainingDisplay).toEqual('400,000');
  });
  it("should have a escrowAmountDisplay of 80,000", () => {
    expect(twentyPercentSoldBalance.escrowAmountDisplay).toEqual('80,000');
  });
});
