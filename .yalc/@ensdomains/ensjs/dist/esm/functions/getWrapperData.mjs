// src/functions/getWrapperData.ts
import { MAX_DATE_INT } from "../utils/consts.mjs";
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
    let expiryDate;
    if (expiry.gt(0)) {
      const msBigNumber = expiry.mul(1e3);
      if (msBigNumber.gte(MAX_DATE_INT)) {
        expiryDate = new Date(MAX_DATE_INT);
      } else {
        expiryDate = new Date(msBigNumber.toNumber());
      }
    }
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
