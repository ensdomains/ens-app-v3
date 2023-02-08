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
var getName_exports = {};
__export(getName_exports, {
  default: () => getName_default
});
module.exports = __toCommonJS(getName_exports);
var import_hexEncodedName = require("../utils/hexEncodedName");
const raw = async ({ contracts }, address) => {
  const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
  const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData("reverse(bytes)", [
      (0, import_hexEncodedName.hexEncodeName)(reverseNode)
    ])
  };
};
const decode = async ({ contracts }, data, address) => {
  if (data === null)
    return;
  const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
  try {
    const result = universalResolver.interface.decodeFunctionResult(
      "reverse(bytes)",
      data
    );
    return {
      name: result["0"],
      match: result["1"].toLowerCase() === address.toLowerCase(),
      reverseResolverAddress: result["2"],
      resolverAddress: result["3"]
    };
  } catch {
    return { name: void 0 };
  }
};
var getName_default = {
  raw,
  decode
};
