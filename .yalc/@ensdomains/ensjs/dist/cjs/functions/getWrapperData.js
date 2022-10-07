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
var import_ethers = require("ethers");
var import_fuses = require("../utils/fuses");
var import_normalise = require("../utils/normalise");
const raw = async ({ contracts }, name) => {
  const nameWrapper = await contracts?.getNameWrapper();
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData("getData", [(0, import_normalise.namehash)(name)])
  };
};
const decode = async ({ contracts }, data) => {
  const nameWrapper = await contracts?.getNameWrapper();
  try {
    const [owner, _fuses, expiry] = nameWrapper.interface.decodeFunctionResult(
      "getData",
      data
    );
    const fuses = import_ethers.BigNumber.from(_fuses);
    const fuseObj = Object.fromEntries(
      Object.keys(import_fuses.fuseEnum).map((fuse) => [
        fuse,
        fuses.and(import_fuses.fuseEnum[fuse]).gt(0)
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
    console.error("Error decoding wrapper data: ", e);
    return;
  }
};
var getWrapperData_default = {
  raw,
  decode
};
