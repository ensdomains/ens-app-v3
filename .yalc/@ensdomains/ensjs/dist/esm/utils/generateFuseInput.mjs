// src/utils/generateFuseInput.ts
import { ethers } from "ethers";
import fuses from "./fuses.mjs";
var generateFuseInput_default = (fuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions).filter(
    (opt) => fuseOptions[opt] === true
  );
  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(fuses[curr]);
  }, ethers.BigNumber.from(0));
  return bigNumberFuses.toHexString();
};
export {
  generateFuseInput_default as default
};
