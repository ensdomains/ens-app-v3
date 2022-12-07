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
var ccip_exports = {};
__export(ccip_exports, {
  default: () => ccip_default
});
module.exports = __toCommonJS(ccip_exports);
var import_ethers = require("ethers");
var import_utils = require("ethers/lib/utils");
function bytesPad(value) {
  if (value.length % 32 === 0) {
    return value;
  }
  const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
  result.set(value);
  return result;
}
function numPad(value) {
  const result = (0, import_utils.arrayify)(value);
  if (result.length > 32) {
    throw new Error("internal; should not happen");
  }
  const padded = new Uint8Array(32);
  padded.set(result, 32 - result.length);
  return padded;
}
function encodeBytes(datas) {
  const result = [];
  let byteCount = 0;
  for (let i = 0; i < datas.length; i += 1) {
    result.push(new Uint8Array(0));
    byteCount += 32;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const data = (0, import_utils.arrayify)(datas[i]);
    result[i] = numPad(byteCount);
    result.push(numPad(data.length));
    result.push(bytesPad(data));
    byteCount += 32 + Math.ceil(data.length / 32) * 32;
  }
  return (0, import_utils.hexConcat)(result);
}
function _parseBytes(result, start) {
  if (result === "0x") {
    return null;
  }
  const offset = import_ethers.BigNumber.from(
    (0, import_utils.hexDataSlice)(result, start, start + 32)
  ).toNumber();
  const length = import_ethers.BigNumber.from(
    (0, import_utils.hexDataSlice)(result, offset, offset + 32)
  ).toNumber();
  return (0, import_utils.hexDataSlice)(result, offset + 32, offset + 32 + length);
}
function _parseString(result, start) {
  try {
    const bytes = _parseBytes(result, start);
    if (bytes == null)
      return null;
    return (0, import_utils.toUtf8String)(bytes);
  } catch (error) {
  }
  return null;
}
const ccipLookup = async (provider, transaction, result) => {
  const txSender = transaction.to;
  try {
    const data = (0, import_utils.hexDataSlice)(result, 4);
    const sender = (0, import_utils.hexDataSlice)(data, 0, 32);
    if (!import_ethers.BigNumber.from(sender).eq(txSender)) {
      throw new Error("CCIP Read sender did not match");
    }
    const urls = [];
    const urlsOffset = import_ethers.BigNumber.from((0, import_utils.hexDataSlice)(data, 32, 64)).toNumber();
    const urlsLength = import_ethers.BigNumber.from(
      (0, import_utils.hexDataSlice)(data, urlsOffset, urlsOffset + 32)
    ).toNumber();
    const urlsData = (0, import_utils.hexDataSlice)(data, urlsOffset + 32);
    for (let u = 0; u < urlsLength; u += 1) {
      const url = _parseString(urlsData, u * 32);
      if (url == null) {
        throw new Error("CCIP Read contained corrupt URL string");
      }
      urls.push(url);
    }
    const calldata = _parseBytes(data, 64);
    if (!import_ethers.BigNumber.from((0, import_utils.hexDataSlice)(data, 100, 128)).isZero()) {
      throw new Error("CCIP Read callback selected included junk");
    }
    const callbackSelector = (0, import_utils.hexDataSlice)(data, 96, 100);
    const extraData = _parseBytes(data, 128);
    const ccipResult = await provider.ccipReadFetch(
      transaction,
      calldata,
      urls
    );
    if (ccipResult == null) {
      throw new Error("CCIP Read disabled or provided no URLs");
    }
    const tx = {
      to: sender,
      data: (0, import_utils.hexConcat)([
        callbackSelector,
        encodeBytes([ccipResult, extraData])
      ])
    };
    return await provider._call(tx, "latest", 1);
  } catch (error) {
    console.error(error);
  }
};
var ccip_default = ccipLookup;
