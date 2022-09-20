// src/functions/getFuses.ts
import { BigNumber } from "ethers";
import { fuseEnum } from "../utils/fuses.mjs";
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
    const {
      owner,
      fuses: _fuses,
      expiry
    } = nameWrapper.interface.decodeFunctionResult("getData", data);
    const fuses = BigNumber.from(_fuses);
    const fuseObj = Object.fromEntries(
      Object.keys(fuseEnum).map((fuse) => [
        fuse,
        fuses.and(fuseEnum[fuse]).gt(0)
      ])
    );
    if (fuses.eq(0)) {
      fuseObj.CAN_DO_EVERYTHING = true;
    } else {
      fuseObj.CAN_DO_EVERYTHING = false;
    }
    const expiryDate = new Date(expiry * 1e3);
    return {
      fuseObj,
      expiryDate,
      rawFuses: fuses,
      owner
    };
  } catch (e) {
    console.error("Error decoding fuses data: ", e);
    return;
  }
};
var getFuses_default = {
  raw,
  decode
};
export {
  getFuses_default as default
};
