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
var getPrice_exports = {};
__export(getPrice_exports, {
  default: () => getPrice_default
});
module.exports = __toCommonJS(getPrice_exports);
var import_abi = require("@ethersproject/abi");
var import_bignumber = require("@ethersproject/bignumber");
const raw = async ({ contracts, multicallWrapper }, nameOrNames, duration, legacy) => {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
  if (names.length > 1) {
    const bulkRenewal = await (contracts == null ? void 0 : contracts.getBulkRenewal());
    const baseCall2 = {
      to: bulkRenewal.address,
      data: bulkRenewal.interface.encodeFunctionData("rentPrice", [
        names,
        duration
      ])
    };
    if (legacy) {
      return multicallWrapper.raw([
        baseCall2,
        {
          to: bulkRenewal.address,
          data: bulkRenewal.interface.encodeFunctionData("rentPrice", [
            names,
            0
          ])
        }
      ]);
    }
    return baseCall2;
  }
  const controller = await (contracts == null ? void 0 : contracts.getEthRegistrarController());
  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData("rentPrice", [
      names[0],
      duration
    ])
  };
  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData("rentPrice", [
          names[0],
          0
        ])
      }
    ]);
  }
  return baseCall;
};
const decode = async ({ contracts, multicallWrapper }, data, _nameOrNames, _duration, legacy) => {
  if (data === null)
    return;
  try {
    let base;
    let premium;
    const isBulkRenewal = Array.isArray(_nameOrNames) && _nameOrNames.length > 1;
    if (isBulkRenewal && legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = import_abi.defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = import_abi.defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else if (isBulkRenewal) {
      const bulkRenewal = await (contracts == null ? void 0 : contracts.getBulkRenewal());
      const result = bulkRenewal.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      [base] = result;
      premium = import_bignumber.BigNumber.from(0);
    } else if (!isBulkRenewal && legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = import_abi.defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = import_abi.defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else {
      const controller = await (contracts == null ? void 0 : contracts.getEthRegistrarController());
      const result = controller.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      [base, premium] = result[0];
    }
    return {
      base,
      premium
    };
  } catch {
    return;
  }
};
var getPrice_default = { raw, decode };
