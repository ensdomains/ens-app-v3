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
const raw = async ({ contracts, multicallWrapper }, name, duration, legacy) => {
  const controller = await contracts?.getEthRegistrarController();
  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData("rentPrice", [
      name,
      duration
    ])
  };
  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData("rentPrice", [name, 0])
      }
    ]);
  }
  return baseCall;
};
const decode = async ({ contracts, multicallWrapper }, data, _name, _number, legacy) => {
  if (data === null)
    return;
  const controller = await contracts?.getEthRegistrarController();
  try {
    let base;
    let premium;
    if (legacy) {
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
      ;
      [[base, premium]] = controller.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
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
