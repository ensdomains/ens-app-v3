// src/utils/wrapper.ts
import { BigNumber } from "@ethersproject/bignumber/lib.esm/bignumber.js";
import { toUtf8Bytes } from "@ethersproject/strings/lib.esm/utf8.js";
var MAX_EXPIRY = BigNumber.from(2).pow(64).sub(1);
var makeExpiry = async ({ getExpiry }, name, expiry) => {
  if (expiry) {
    if (expiry instanceof Date) {
      return BigNumber.from(expiry.getTime() / 1e3);
    }
    if (expiry instanceof BigNumber) {
      return expiry;
    }
    return BigNumber.from(expiry);
  }
  if (name.endsWith(".eth")) {
    const expResponse = await getExpiry(name);
    if (!expResponse?.expiry)
      throw new Error("Couldn't get expiry for name, please provide one.");
    return BigNumber.from(expResponse.expiry.getTime() / 1e3);
  }
  return MAX_EXPIRY;
};
var wrappedLabelLengthCheck = (label) => {
  const bytes = toUtf8Bytes(label);
  if (bytes.byteLength > 255)
    throw new Error("Label can't be longer than 255 bytes");
};
export {
  MAX_EXPIRY,
  makeExpiry,
  wrappedLabelLengthCheck
};
