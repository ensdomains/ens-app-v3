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
var getResolver_exports = {};
__export(getResolver_exports, {
  default: () => getResolver_default
});
module.exports = __toCommonJS(getResolver_exports);
var import_bytes = require("@ethersproject/bytes");
var import_hexEncodedName = require("../utils/hexEncodedName");
const raw = async ({ contracts }, name) => {
  const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData("findResolver", [
      (0, import_hexEncodedName.hexEncodeName)(name)
    ])
  };
};
const decode = async ({ contracts }, data) => {
  const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
  const response = universalResolver.interface.decodeFunctionResult(
    "findResolver",
    data
  );
  if (!response || !response[0] || (0, import_bytes.hexStripZeros)(response[0]) === "0x") {
    return;
  }
  return response[0];
};
var getResolver_default = { raw, decode };
