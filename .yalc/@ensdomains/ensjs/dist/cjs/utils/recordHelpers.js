"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recordHelpers_exports = {};
__export(recordHelpers_exports, {
  generateRecordCallArray: () => generateRecordCallArray,
  generateSetAddr: () => generateSetAddr,
  generateSingleRecordCall: () => generateSingleRecordCall
});
module.exports = __toCommonJS(recordHelpers_exports);
var import_address_encoder = require("@ensdomains/address-encoder");
var import_contentHash = require("./contentHash");
const generateSetAddr = (namehash, coinType, address, resolver) => {
  let coinTypeInstance;
  if (!Number.isNaN(parseInt(coinType))) {
    coinTypeInstance = import_address_encoder.formatsByCoinType[parseInt(coinType)];
  } else {
    coinTypeInstance = import_address_encoder.formatsByName[coinType.toUpperCase()];
  }
  const inputCoinType = coinTypeInstance.coinType;
  const encodedAddress = coinTypeInstance.decoder(address);
  return resolver?.interface.encodeFunctionData(
    "setAddr(bytes32,uint256,bytes)",
    [namehash, inputCoinType, encodedAddress]
  );
};
function generateSingleRecordCall(namehash, resolver, type) {
  if (type === "contentHash") {
    return (_r) => {
      const record = _r;
      let _contentHash = "";
      if (record !== _contentHash) {
        const encoded = (0, import_contentHash.encodeContenthash)(record);
        if (encoded.error)
          throw new Error(encoded.error);
        _contentHash = encoded.encoded;
      }
      return resolver.interface.encodeFunctionData("setContenthash", [
        namehash,
        _contentHash
      ]);
    };
  }
  return (_r) => {
    const record = _r;
    if (type === "text") {
      return resolver.interface.encodeFunctionData("setText", [
        namehash,
        record.key,
        record.value
      ]);
    }
    return generateSetAddr(namehash, record.key, record.value, resolver);
  };
}
const generateRecordCallArray = (namehash, records, resolver) => {
  const calls = [];
  if (records.clearRecords) {
    calls.push(
      resolver.interface.encodeFunctionData("clearRecords", [namehash])
    );
  }
  if (records.contentHash) {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      "contentHash"
    )(records.contentHash);
    if (data)
      calls.push(data);
  }
  if (records.texts && records.texts.length > 0) {
    records.texts.map(generateSingleRecordCall(namehash, resolver, "text")).forEach((call) => calls.push(call));
  }
  if (records.coinTypes && records.coinTypes.length > 0) {
    records.coinTypes.map(generateSingleRecordCall(namehash, resolver, "addr")).forEach((call) => calls.push(call));
  }
  return calls;
};
