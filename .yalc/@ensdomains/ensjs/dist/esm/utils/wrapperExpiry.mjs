// src/utils/wrapperExpiry.ts
import { BigNumber } from "ethers";
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
export {
  MAX_EXPIRY,
  makeExpiry
};
