"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var wrapName_exports = {};
__export(wrapName_exports, {
  default: () => wrapName_default
});
module.exports = __toCommonJS(wrapName_exports);
var import_ethers = require("ethers");
var import_generateFuseInput = __toESM(require("../utils/generateFuseInput"));
var import_hexEncodedName = require("../utils/hexEncodedName");
var import_wrapper = require("../utils/wrapper");
async function wrapETH({ contracts }, labels, wrappedOwner, expiry, decodedFuses, resolverAddress, signer, address) {
  const nameWrapper = await contracts?.getNameWrapper();
  const baseRegistrar = (await contracts.getBaseRegistrar()).connect(signer);
  const labelhash = import_ethers.ethers.utils.solidityKeccak256(["string"], [labels[0]]);
  const data = import_ethers.ethers.utils.defaultAbiCoder.encode(
    ["string", "address", "uint32", "uint64", "address"],
    [labels[0], wrappedOwner, decodedFuses, expiry, resolverAddress]
  );
  return baseRegistrar.populateTransaction["safeTransferFrom(address,address,uint256,bytes)"](address, nameWrapper.address, labelhash, data);
}
async function wrapOther({ contracts }, name, wrappedOwner, resolverAddress, address, signer) {
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const registry = await contracts?.getRegistry();
  const hasApproval = await registry.isApprovedForAll(
    address,
    nameWrapper.address
  );
  if (!hasApproval) {
    throw new Error(
      "NameWrapper must have approval to wrap a name from this address."
    );
  }
  return nameWrapper.populateTransaction.wrap(
    (0, import_hexEncodedName.hexEncodeName)(name),
    wrappedOwner,
    resolverAddress
  );
}
async function wrapName_default({
  contracts,
  signer,
  getExpiry
}, name, {
  wrappedOwner,
  fuseOptions,
  expiry,
  resolverAddress
}) {
  const address = await signer.getAddress();
  let decodedFuses;
  const publicResolver = await contracts?.getPublicResolver();
  if (!resolverAddress)
    resolverAddress = publicResolver.address;
  const labels = name.split(".");
  (0, import_wrapper.wrappedLabelLengthCheck)(labels[0]);
  if (labels.length === 2 && labels[1] === "eth") {
    switch (typeof fuseOptions) {
      case "object": {
        decodedFuses = (0, import_generateFuseInput.default)(fuseOptions);
        break;
      }
      case "number": {
        decodedFuses = fuseOptions.toString(16);
        break;
      }
      case "string": {
        decodedFuses = fuseOptions;
        break;
      }
      case "undefined": {
        decodedFuses = "0";
        break;
      }
      default: {
        throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`);
      }
    }
    const expiryToUse = await (0, import_wrapper.makeExpiry)({ getExpiry }, name, expiry);
    return wrapETH(
      { contracts },
      labels,
      wrappedOwner,
      expiryToUse,
      decodedFuses,
      resolverAddress,
      signer,
      address
    );
  }
  if (fuseOptions)
    throw new Error(
      "Fuses can not be initially set when wrapping a non .eth name"
    );
  if (expiry)
    throw new Error(
      "Expiry can not be initially set when wrapping a non .eth name"
    );
  return wrapOther(
    { contracts },
    name,
    wrappedOwner,
    resolverAddress,
    address,
    signer
  );
}
