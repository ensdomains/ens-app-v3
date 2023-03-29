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
var wrapName_exports = {};
__export(wrapName_exports, {
  default: () => wrapName_default
});
module.exports = __toCommonJS(wrapName_exports);
var import_abi = require("@ethersproject/abi");
var import_solidity = require("@ethersproject/solidity");
var import_fuses = require("../utils/fuses");
var import_hexEncodedName = require("../utils/hexEncodedName");
var import_validation = require("../utils/validation");
var import_wrapper = require("../utils/wrapper");
async function wrapETH({ contracts }, labels, wrappedOwner, decodedFuses, resolverAddress, signer, address) {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  const baseRegistrar = (await contracts.getBaseRegistrar()).connect(signer);
  const labelhash = (0, import_solidity.keccak256)(["string"], [labels[0]]);
  const data = import_abi.defaultAbiCoder.encode(
    ["string", "address", "uint16", "address"],
    [labels[0], wrappedOwner, decodedFuses, resolverAddress]
  );
  return baseRegistrar.populateTransaction["safeTransferFrom(address,address,uint256,bytes)"](address, nameWrapper.address, labelhash, data);
}
async function wrapOther({ contracts }, name, wrappedOwner, resolverAddress, address, signer) {
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const registry = await (contracts == null ? void 0 : contracts.getRegistry());
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
async function wrapName_default({ contracts, signer }, name, {
  wrappedOwner,
  fuseOptions,
  expiry,
  resolverAddress
}) {
  const address = await signer.getAddress();
  let decodedFuses;
  const publicResolver = await (contracts == null ? void 0 : contracts.getPublicResolver());
  if (!resolverAddress)
    resolverAddress = publicResolver.address;
  const labels = name.split(".");
  (0, import_wrapper.wrappedLabelLengthCheck)(labels[0]);
  if ((0, import_validation.checkIsDotEth)(labels)) {
    switch (typeof fuseOptions) {
      case "object": {
        decodedFuses = (0, import_fuses.encodeFuses)(fuseOptions);
        break;
      }
      case "number": {
        decodedFuses = fuseOptions;
        break;
      }
      case "undefined": {
        decodedFuses = 0;
        break;
      }
      default: {
        throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`);
      }
    }
    return wrapETH(
      { contracts },
      labels,
      wrappedOwner,
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
