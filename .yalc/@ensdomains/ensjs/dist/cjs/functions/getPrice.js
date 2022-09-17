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
var import_ethers = require("ethers");
const raw = async ({ contracts, multicallWrapper }, nameOrNames, duration, legacy) => {
  console.log("get price raw");
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
  if (names.length > 1) {
    const bulkRenewal = await contracts?.getBulkRenewal();
    console.log("bulkRenewal", bulkRenewal);
    console.log("names", names, "duration", duration);
    return {
      to: bulkRenewal.address,
      data: bulkRenewal.interface.encodeFunctionData("rentPrice", [
        names,
        duration
      ])
    };
  }
  const controller = await contracts?.getEthRegistrarController();
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
  console.log("baseCall", baseCall);
  return baseCall;
};
const decode = async ({ contracts, multicallWrapper }, data, _nameOrNames, _duration, legacy) => {
  console.log("decode", data, _nameOrNames, _duration, legacy);
  if (data === null)
    return;
  try {
    let base;
    let premium;
    if (Array.isArray(_nameOrNames) && _nameOrNames.length > 1) {
      const bulkRenewal = await contracts?.getBulkRenewal();
      const result = bulkRenewal.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      console.log("result", result);
      [base] = result;
      premium = import_ethers.BigNumber.from(0);
    } else if (legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = import_ethers.utils.defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = import_ethers.utils.defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else {
      const controller = await contracts?.getEthRegistrarController();
      const result = controller.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      console.log("result", result);
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
