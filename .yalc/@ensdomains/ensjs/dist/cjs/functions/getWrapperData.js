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
var getWrapperData_exports = {};
__export(getWrapperData_exports, {
  default: () => getWrapperData_default
});
module.exports = __toCommonJS(getWrapperData_exports);
var import_bignumber = require("@ethersproject/bignumber/lib/bignumber");
var import_fuses = require("../utils/fuses");
var import_normalise = require("../utils/normalise");
const raw = async ({ contracts }, name) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData("getData", [(0, import_normalise.namehash)(name)])
  };
};
const decode = async ({ contracts }, data) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  try {
    const [owner, fuses, expiry] = nameWrapper.interface.decodeFunctionResult(
      "getData",
      data
    );
    const fuseObj = (0, import_fuses.decodeFuses)(fuses);
    const expiryDate = expiry.gt(0) && expiry.lt(import_bignumber.BigNumber.from(2).pow(32)) ? new Date(expiry.mul(1e3).toString()) : void 0;
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
