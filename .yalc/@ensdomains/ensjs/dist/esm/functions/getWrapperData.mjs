// src/functions/getWrapperData.ts
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
    const expiryDate = expiry.gt(0) ? new Date(expiry.toNumber() * 1e3) : void 0;
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
