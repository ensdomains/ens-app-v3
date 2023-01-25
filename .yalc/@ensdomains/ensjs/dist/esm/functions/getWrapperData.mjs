// src/functions/getWrapperData.ts
import { BigNumber } from "@ethersproject/bignumber/lib.esm/bignumber.js";
import { decodeFuses } from "../utils/fuses.mjs";
import { namehash } from "../utils/normalise.mjs";
var raw = async ({ contracts }, name) => {
  const nameWrapper = await contracts?.getNameWrapper();
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData("getData", [namehash(name)])
  };
};
var decode = async ({ contracts }, data) => {
  const nameWrapper = await contracts?.getNameWrapper();
  try {
    const [owner, fuses, expiry] = nameWrapper.interface.decodeFunctionResult(
      "getData",
      data
    );
    const fuseObj = decodeFuses(fuses);
    const expiryDate = expiry.gt(0) && expiry.lt(BigNumber.from(2).pow(32)) ? new Date(expiry.mul(1e3).toString()) : void 0;
    return {
      ...fuseObj,
      expiryDate,
      rawFuses: fuses,
      owner
    };
  } catch (e) {
    console.error("Error decoding wrapper data: ", e);
    return;
  }
};
var getWrapperData_default = {
  raw,
  decode
};
export {
  getWrapperData_default as default
};
