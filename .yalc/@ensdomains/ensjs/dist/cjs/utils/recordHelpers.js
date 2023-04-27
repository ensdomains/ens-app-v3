"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recordHelpers_exports = {};
__export(recordHelpers_exports, {
  generateABIInput: () => generateABIInput,
  generateRecordCallArray: () => generateRecordCallArray,
  generateSetAddr: () => generateSetAddr,
  generateSingleRecordCall: () => generateSingleRecordCall
});
module.exports = __toCommonJS(recordHelpers_exports);
var import_address_encoder = require("@ensdomains/address-encoder");
var import_bytes = require("@ethersproject/bytes");
var import_strings = require("@ethersproject/strings");
var import_contentHash = require("./contentHash");
const generateSetAddr = (namehash, coinType, address, resolver) => {
  let coinTypeInstance;
  if (!Number.isNaN(parseInt(coinType))) {
    coinTypeInstance = import_address_encoder.formatsByCoinType[parseInt(coinType)];
  } else {
    coinTypeInstance = import_address_encoder.formatsByName[coinType.toUpperCase()];
  }
  const inputCoinType = coinTypeInstance.coinType;
  let encodedAddress = address !== "" ? coinTypeInstance.decoder(address) : "0x";
  if (inputCoinType === 60 && encodedAddress === "0x")
    encodedAddress = coinTypeInstance.decoder(
      "0x0000000000000000000000000000000000000000"
    );
  return resolver == null ? void 0 : resolver.interface.encodeFunctionData(
    "setAddr(bytes32,uint256,bytes)",
    [namehash, inputCoinType, encodedAddress]
  );
};
const generateABIInput = async (encodeAs, data) => {
  let contentType;
  let encodedData;
  switch (encodeAs) {
    case "json":
      contentType = 1;
      encodedData = JSON.stringify(data);
      break;
    case "zlib": {
      contentType = 2;
      const { deflate } = await import("pako/dist/pako_deflate.min.js");
      encodedData = deflate(JSON.stringify(data));
      break;
    }
    case "cbor": {
      contentType = 4;
      const { encode } = await import("cbor");
      encodedData = encode(data);
      break;
    }
    default: {
      contentType = 8;
      encodedData = data;
      break;
    }
  }
  return { contentType, data: encodedData };
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
      } else {
        _contentHash = "0x";
      }
      return resolver.interface.encodeFunctionData("setContenthash", [
        namehash,
        _contentHash
      ]);
    };
  }
  if (type === "abi") {
    return (_r) => {
      const record = _r;
      const { contentType = 1, data } = record;
      let encodedData = data;
      if (!(0, import_bytes.isBytesLike)(encodedData)) {
        if (typeof encodedData === "object") {
          encodedData = JSON.stringify(encodedData);
        }
        encodedData = (0, import_strings.toUtf8Bytes)(encodedData);
      }
      return resolver.interface.encodeFunctionData("setABI", [
        namehash,
        contentType,
        encodedData
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
  if (typeof records.contentHash === "string") {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      "contentHash"
    )(records.contentHash);
    if (data)
      calls.push(data);
  }
  if (records.abi) {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      "abi"
    )(records.abi);
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
