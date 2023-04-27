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
var getExpiry_exports = {};
__export(getExpiry_exports, {
  default: () => getExpiry_default
});
module.exports = __toCommonJS(getExpiry_exports);
var import_solidity = require("@ethersproject/solidity");
var import_normalise = require("../utils/normalise");
var import_validation = require("../utils/validation");
const getRegistrarExpiry = async ({ contracts, multicallWrapper }, labels) => {
  if (labels.length > 2 || labels[1] !== "eth") {
    throw new Error("Only .eth names have expiry dates on the registrar");
  }
  const baseRegistrar = await (contracts == null ? void 0 : contracts.getBaseRegistrar());
  const expiryCall = baseRegistrar.interface.encodeFunctionData("nameExpires", [
    (0, import_solidity.keccak256)(["string"], [labels[0]])
  ]);
  const gracePeriodCall = baseRegistrar.interface.encodeFunctionData("GRACE_PERIOD");
  return multicallWrapper.raw([
    {
      to: baseRegistrar.address,
      data: expiryCall
    },
    {
      to: baseRegistrar.address,
      data: gracePeriodCall
    }
  ]);
};
const getWrapperExpiry = async ({ contracts }, labels) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  const expiryCall = nameWrapper.interface.encodeFunctionData("getData", [
    (0, import_normalise.namehash)(labels.join("."))
  ]);
  return {
    to: nameWrapper.address,
    data: expiryCall
  };
};
const getContractToUse = (contract, labels) => {
  if (contract)
    return contract;
  if ((0, import_validation.checkIsDotEth)(labels)) {
    return "registrar";
  }
  return "nameWrapper";
};
const raw = async (ensArgs, name, { contract } = {}) => {
  const labels = name.split(".");
  const contractToUse = getContractToUse(contract, labels);
  return contractToUse === "nameWrapper" ? getWrapperExpiry(ensArgs, labels) : getRegistrarExpiry(ensArgs, labels);
};
const decodeRegistrarExpiry = async ({ contracts, multicallWrapper }, data) => {
  const result = await multicallWrapper.decode(data);
  const baseRegistrar = await (contracts == null ? void 0 : contracts.getBaseRegistrar());
  try {
    const [nameExpires] = baseRegistrar.interface.decodeFunctionResult(
      "nameExpires",
      result[0].returnData
    );
    const [gracePeriod] = baseRegistrar.interface.decodeFunctionResult(
      "GRACE_PERIOD",
      result[1].returnData
    );
    return {
      expiry: nameExpires > 0 ? new Date(nameExpires * 1e3) : null,
      gracePeriod: gracePeriod.toNumber() * 1e3
    };
  } catch {
    return;
  }
};
const decodeWrapperExpiry = async ({ contracts }, data) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  try {
    const [, , expiry] = nameWrapper.interface.decodeFunctionResult(
      "getData",
      data
    );
    return {
      expiry: new Date(expiry * 1e3),
      gracePeriod: null
    };
  } catch {
    return;
  }
};
const decode = async (ensArgs, data, name, { contract } = {}) => {
  if (data === null)
    return;
  const labels = name.split(".");
  const contractToUse = getContractToUse(contract, labels);
  return contractToUse === "nameWrapper" ? decodeWrapperExpiry(ensArgs, data) : decodeRegistrarExpiry(ensArgs, data);
};
var getExpiry_default = {
  raw,
  decode
};
