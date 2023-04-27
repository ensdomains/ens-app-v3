// src/utils/ccip.ts
import { BigNumber } from "@ethersproject/bignumber";
import {
  arrayify,
  hexConcat,
  hexDataSlice
} from "@ethersproject/bytes";
import { toUtf8String } from "@ethersproject/strings";
function bytesPad(value) {
  if (value.length % 32 === 0) {
    return value;
  }
  const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
  result.set(value);
  return result;
}
function numPad(value) {
  const result = arrayify(value);
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
    const data = arrayify(datas[i]);
    result[i] = numPad(byteCount);
    result.push(numPad(data.length));
    result.push(bytesPad(data));
    byteCount += 32 + Math.ceil(data.length / 32) * 32;
  }
  return hexConcat(result);
}
function _parseBytes(result, start) {
  if (result === "0x") {
    return null;
  }
  const offset = BigNumber.from(
    hexDataSlice(result, start, start + 32)
  ).toNumber();
  const length = BigNumber.from(
    hexDataSlice(result, offset, offset + 32)
  ).toNumber();
  return hexDataSlice(result, offset + 32, offset + 32 + length);
}
function _parseString(result, start) {
  try {
    const bytes = _parseBytes(result, start);
    if (bytes == null)
      return null;
    return toUtf8String(bytes);
  } catch (error) {
  }
  return null;
}
var ccipLookup = async (provider, transaction, result) => {
  const txSender = transaction.to;
  try {
    const data = hexDataSlice(result, 4);
    const sender = hexDataSlice(data, 0, 32);
    if (!BigNumber.from(sender).eq(txSender)) {
      throw new Error("CCIP Read sender did not match");
    }
    const urls = [];
    const urlsOffset = BigNumber.from(hexDataSlice(data, 32, 64)).toNumber();
    const urlsLength = BigNumber.from(
      hexDataSlice(data, urlsOffset, urlsOffset + 32)
    ).toNumber();
    const urlsData = hexDataSlice(data, urlsOffset + 32);
    for (let u = 0; u < urlsLength; u += 1) {
      const url = _parseString(urlsData, u * 32);
      if (url == null) {
        throw new Error("CCIP Read contained corrupt URL string");
      }
      urls.push(url);
    }
    const calldata = _parseBytes(data, 64);
    if (!BigNumber.from(hexDataSlice(data, 100, 128)).isZero()) {
      throw new Error("CCIP Read callback selected included junk");
    }
    const callbackSelector = hexDataSlice(data, 96, 100);
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
      to: txSender,
      data: hexConcat([
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
export {
  ccip_default as default
};
