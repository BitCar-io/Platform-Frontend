import { processError } from '../../util/web3/web3Wrapper';
const CryptoJS = require('crypto-js');
const sha3 = require('crypto-js/sha3');

// const binFilePath = __dirname + '/resources/bin-file.jpg';
// const txtFilePath = __dirname + '/resources/text-file.txt';

export const getSignature = async (_user, _data, web3) => {
//   console.log("", 0);
//   console.log("Data length (in MB): " + _data.length / (1024 * 1024), 1);
//   let start = new Date();
  let dataSig = await signData(_user, _data, web3);
//   console.log('dataSig', dataSig);
//   console.log("Data signing exec time " + (new Date() - start) + " ms.", 1);
//   console.log("sha3: " + dataSig.h, 1);
//   console.log(
//     "sha3 control ok?: " + (stringSha3(bufferToHexString(_data)) == dataSig.h),
//     1
//   );
//   console.log("raw signature: " + dataSig.rawSig, 1);
//   console.log("v: " + dataSig.v, 1);
//   console.log("r: " + dataSig.r, 1);
//   console.log("s: " + dataSig.s, 1);
  return dataSig;
};

export const signData = (_account, _dataBuffer, web3) => {
    let h = binarySha3(_dataBuffer);
    var params = [h, _account]
    var method = 'personal_sign'

    const signPromise = new Promise((resolve, reject) => {

        web3.currentProvider.send(method, params, _account)
        .then((rawSig) => {
            const sigParameters = web3.utils.getSignatureParameters(rawSig);
            const r = sigParameters.r;
            const s = sigParameters.s;
            const v = sigParameters.v;
            
            resolve({rawSig, h, v, r, s });
        })
        .catch((error) => {
            reject(processError(error));
        })
    });

    return signPromise;
};

// const stringSha3 = _hexStr => {
//   if (_hexStr.length > 2 && _hexStr.substr(0, 2) === "0x") {
//     _hexStr = _hexStr.substr(2);
//   }
//   let _wordArr = CryptoJS.enc.Hex.parse(_hexStr);
//   return (
//     "0x" +
//     sha3(_wordArr, {
//       outputLength: 256
//     }).toString()
//   );
// };

const binarySha3 = _buffer => {
  let _wordArr = bufferToWordArray(_buffer);
  return (
    "0x" +
    sha3(_wordArr, {
      outputLength: 256
    }).toString()
  );
};

const bufferToWordArray = _buffer => {
  var bufferLength = _buffer.length;
  var words = [];
  for (var i = 0; i < bufferLength; i++) {
    words[i >>> 2] |= _buffer.readUInt8(i) << (24 - (i % 8) * 8);
  }
  return new CryptoJS.lib.WordArray.init(words, bufferLength);
};

// const bufferToHexString = (
//     _buffer
// ) => {
//     return "0x" + Array.prototype.map.call(new Uint8Array(_buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
// }
