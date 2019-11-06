import BigNumber from 'bignumber.js';
import * as helper from 'util/helpers';
import { DISPLAY_DECIMALS_ETH } from 'util/globalVariables';

describe("Testing doStringsMatchIgnoringCase", () => {
    it("should match two undefined parameters", () => {
        expect(helper.doStringsMatchIgnoringCase(undefined, undefined)).toBe(true);
    });
    it("should match two null parameters", () => {
        expect(helper.doStringsMatchIgnoringCase(null, null)).toBe(true);
    });
    it("should not match a null and undefined", () => {
        expect(helper.doStringsMatchIgnoringCase(null, undefined)).toBe(false);
    });
    it("should not match an undefined and null", () => {
        expect(helper.doStringsMatchIgnoringCase(undefined, null)).toBe(false);
    });
    it("should match two identical strings", () => {
        expect(helper.doStringsMatchIgnoringCase('hello', 'hello')).toBe(true);
    });
    it("should match two strings, where one is uppercase and one is lowercase", () => {
        expect(helper.doStringsMatchIgnoringCase('HELLO', 'hello')).toBe(true);
    });
    it("should match two strings, where one is lowercase and one is uppercase", () => {
        expect(helper.doStringsMatchIgnoringCase('hello', 'HELLO')).toBe(true);
    });
});

describe("Testing convertFromSolidityAndFormatForDisplay", () => {
    it("should show 1,000,000 as 0.0 when passing 1 decimal", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(1000000), 1)).toBe("0.0");
    });
    it("should show 10,000,000 as 0.1 when passing 1 decimal", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(10000000), 1)).toBe("0.1");
    });
    it("should show 100,000,000 as 1.0 when passing 1 decimal", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(100000000), 1)).toBe("1.0");
    });
    it("should show 1,000,000 as 0.01 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(1000000), 2)).toBe("0.01");
    });
    it("should show 10,000,000 as 0.10 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(10000000), 2)).toBe("0.10");
    });
    it("should show 100,000,000 as 1.00 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(100000000), 2)).toBe("1.00");
    });
    it("should round 1,900,000 to 0.02 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(1900000), 2)).toBe("0.02");
    });
    it("should round 10,900,000 to 0.11 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(10900000), 2)).toBe("0.11");
    });
    it("should round 100,900,000 to 1.01 when passing 2 decimals", () => {
        expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber(100900000), 2)).toBe("1.01");
    });
    it("should round 18859028.76001885904 to 0.188590 when using platform ETH decimals", () => {
      expect(helper.convertFromSolidityAndFormatForDisplay(new BigNumber('18859028.76001885904'), DISPLAY_DECIMALS_ETH)).toEqual(new BigNumber('0.188590').toFormat(DISPLAY_DECIMALS_ETH));
    });
    it("should round 18859028.76001885904 to 0.188590 when using platform ETH decimals and passing in a solidity number", () => {
      expect(helper.convertFromSolidityAndFormatForDisplay(helper.convertToSolidityNumber(new BigNumber('0.1885902876001885904')), DISPLAY_DECIMALS_ETH)).toEqual(new BigNumber('0.188590').toFormat(DISPLAY_DECIMALS_ETH));
    });

    let currentNumber;
    let currentDecimal;
    function throwTest() {
        helper.convertFromSolidityAndFormatForDisplay(currentNumber, currentDecimal);
    }

    const bigNumberThrowMessage = "convertFromSolidityAndFormatForDisplay expects a BigNumber object for parameter 'bigNumber'";
    it("should not accept a number as a parameter", () => {
        currentNumber = 10;
        currentDecimal = 2;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept an empty number value", () => {
        currentNumber = undefined;
        currentDecimal = 2;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept a text value for number", () => {
        currentNumber = 'hello world';
        currentDecimal = 2;
        expect(throwTest).toThrowError(bigNumberThrowMessage);
    });

    const decimalThrowMessage = "convertFromSolidityAndFormatForDisplay expects a numerical value for parameter 'decimals'";
    it("should not accept an empty decimal value", () => {
        currentNumber = new BigNumber(10);
        currentDecimal = undefined;
        expect(throwTest).toThrowError(decimalThrowMessage);
    });
    it("should not accept a text value for decimal", () => {
        currentNumber = new BigNumber(10);
        currentDecimal = 'hello world';
        expect(throwTest).toThrowError(decimalThrowMessage);
    });
});

describe("Testing convertToSolidityNumber", () => {
    it("should transform 1 to 100,000,000", () => {
        expect(helper.convertToSolidityNumber(new BigNumber('1'))).toEqual(new BigNumber('100000000'));
    });
    it("should transform 1.23 to 123,000,000", () => {
        expect(helper.convertToSolidityNumber(new BigNumber('1.23'))).toEqual(new BigNumber('123000000'));
    });
    it("should transform 100.12345 to 10,012,345,000", () => {
        expect(helper.convertToSolidityNumber(new BigNumber('100.12345'))).toEqual(new BigNumber('10012345000'));
    });
    it("should transform 100.1234567891 to 10,012,345,679 with rounding", () => {
        expect(helper.convertToSolidityNumber(new BigNumber('100.1234567891'))).toEqual(new BigNumber('10012345679'));
    });
    it("should transform 100.1234444444 to 10,012,344,445 with rounding (we round up last digit to prevent any errors", () => {
        expect(helper.convertToSolidityNumber(new BigNumber('100.1234444444'))).toEqual(new BigNumber('10012344445'));
    });

    let currentNumber;
    function throwTest() {
        helper.convertToSolidityNumber(currentNumber);
    }

    const bigNumberThrowMessage = "convertToSolidityNumber expects a BigNumber object for parameter 'value'";
    it("should not accept a number as a parameter", () => {
        currentNumber = 10;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept an empty number value", () => {
        currentNumber = undefined;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept a text value for number", () => {
        currentNumber = '10';
        expect(throwTest).toThrowError(bigNumberThrowMessage);
    });
});

describe("Testing convertFromSolidityNumber", () => {
    it("should transform 100,000,000 to 1", () => {
        expect(helper.convertFromSolidityNumber(new BigNumber('100000000'))).toEqual(new BigNumber('1'));
    });
    it("should transform 123,000,000 to 1.23", () => {
        expect(helper.convertFromSolidityNumber(new BigNumber('123000000'))).toEqual(new BigNumber('1.23'));
    });
    it("should transform 10,012,345,000 to 100.12345", () => {
        expect(helper.convertFromSolidityNumber(new BigNumber('10012345000'))).toEqual(new BigNumber('100.12345'));
    });
    it("should transform 10,012,345,678 to 100.12345678", () => {
        expect(helper.convertFromSolidityNumber(new BigNumber('10012345678'))).toEqual(new BigNumber('100.12345678'));
    });
    it("should transform 10,012,344,445 to 100.12344445", () => {
        expect(helper.convertFromSolidityNumber(new BigNumber('10012344445'))).toEqual(new BigNumber('100.12344445'));
    });

    let currentNumber;
    function throwTest() {
        helper.convertFromSolidityNumber(currentNumber);
    }

    const bigNumberThrowMessage = "convertFromSolidityNumber expects a BigNumber object for parameter 'value'";
    it("should not accept a number as a parameter", () => {
        currentNumber = 10;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept an empty number value", () => {
        currentNumber = undefined;
        expect(throwTest).toThrow(bigNumberThrowMessage);
    });
    it("should not accept a text value for number", () => {
        currentNumber = '10';
        expect(throwTest).toThrowError(bigNumberThrowMessage);
    });
});

describe("Testing bitcarToUSD", () => {
    it("should transform 100000 BCT to 1000 USD at exchange rate of 0.01", () => {
        expect(helper.bitcarToUSD(new BigNumber(100000), new BigNumber(0.01))).toEqual(new BigNumber(1000));
    });
    it("should transform 100 BCT to 1.254 USD at exchange rate of 0.01254", () => {
        expect(helper.bitcarToUSD(new BigNumber(100), new BigNumber(0.01254))).toEqual(new BigNumber(1.254));
    });
    it("should transform 1 BCT to 0.01254 USD at exchange rate of 0.01254", () => {
        expect(helper.bitcarToUSD(new BigNumber(1), new BigNumber(0.01254))).toEqual(new BigNumber(0.01254));
    });
    it("should transform 100 BCT to 201.254563 USD at exchange rate of 2.01254563", () => {
        expect(helper.bitcarToUSD(new BigNumber(100), new BigNumber(2.01254563))).toEqual(new BigNumber(201.254563));
    });

    // let value;
    // let exRate;
    // function throwTest() {
    //     helper.bitcarToUSD(value, exRate);
    // }
});

describe("Testing USDtoBitcar", () => {
    it("should transform 10000 USD to 100000 BCT at exchange rate of 0.01", () => {
        expect(helper.USDtoBitcar(new BigNumber(10000), new BigNumber('0.01'))).toEqual(new BigNumber(1000000));
    });
    it("should transform 100 USD to 7974.4816586921850079744816587 BCT at exchange rate of 0.01254 with BigNumber rounding", () => {
        expect(helper.USDtoBitcar(new BigNumber(100), new BigNumber('0.01254'))).toEqual(new BigNumber('7974.481658692185007974'));
    });
    it("should transform 10 USD to 797.4481658692185007974 BCT at exchange rate of 0.01254 with BigNumber rounding", () => {
        expect(helper.USDtoBitcar(new BigNumber(10), new BigNumber('0.01254'))).toEqual(new BigNumber('797.4481658692185007974'));
    });
    it("should transform 3 USD to 239.23444976076555023922 BCT at exchange rate of 0.01254 with BigNumber rounding", () => {
        expect(helper.USDtoBitcar(new BigNumber(3), new BigNumber('0.01254'))).toEqual(new BigNumber('239.23444976076555023922'));
    });
    it("should transform 112 USD to 55.65091212366697991392 BCT at exchange rate of 2.01254563", () => {
        expect(helper.USDtoBitcar(new BigNumber(112), new BigNumber('2.01254563'))).toEqual(new BigNumber('55.65091212366697991392'));
    });

    // let value;
    // let exRate;
    // function throwTest() {
    //     helper.bitcarToUSD(value, exRate);
    // }
});