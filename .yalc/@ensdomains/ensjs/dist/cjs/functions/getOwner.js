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
var getOwner_exports = {};
__export(getOwner_exports, {
  default: () => getOwner_default
});
module.exports = __toCommonJS(getOwner_exports);
var import_abi = require("@ethersproject/abi");
var import_bytes = require("@ethersproject/bytes");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
var import_validation = require("../utils/validation");
var import_errors = require("../utils/errors");
const singleContractOwnerRaw = async ({ contracts }, contract, namehash, labels) => {
  switch (contract) {
    case "nameWrapper": {
      const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
      return {
        to: nameWrapper.address,
        data: nameWrapper.interface.encodeFunctionData("ownerOf", [namehash])
      };
    }
    case "registry": {
      const registry = await (contracts == null ? void 0 : contracts.getRegistry());
      return {
        to: registry.address,
        data: registry.interface.encodeFunctionData("owner", [namehash])
      };
    }
    case "registrar": {
      const registrar = await (contracts == null ? void 0 : contracts.getBaseRegistrar());
      return {
        to: registrar.address,
        data: registrar.interface.encodeFunctionData("ownerOf", [
          (0, import_labels.labelhash)(labels[0])
        ])
      };
    }
  }
};
const raw = async ({ contracts, multicallWrapper }, name, options = {}) => {
  const { contract } = options;
  const namehash = (0, import_normalise.namehash)(name);
  const labels = name.split(".");
  if (contract || labels.length === 1) {
    return singleContractOwnerRaw(
      { contracts },
      contract || "registry",
      namehash,
      labels
    );
  }
  const registryData = await singleContractOwnerRaw(
    { contracts },
    "registry",
    namehash,
    labels
  );
  const nameWrapperData = await singleContractOwnerRaw(
    { contracts },
    "nameWrapper",
    namehash,
    labels
  );
  const registrarData = await singleContractOwnerRaw(
    { contracts },
    "registrar",
    namehash,
    labels
  );
  const data = [registryData, nameWrapperData];
  if ((0, import_validation.checkIsDotEth)(labels)) {
    data.push(registrarData);
  }
  return multicallWrapper.raw(data);
};
const registrantQuery = `
  query GetRegistrant($namehash: String!) {
    domain(id: $namehash) {
      registration {
        registrant {
          id
        }
      }
    }
  }
`;
const singleContractOwnerDecode = (data) => import_abi.defaultAbiCoder.decode(["address"], data)[0];
const decode = async ({
  contracts,
  multicallWrapper,
  gqlInstance
}, data, name, options = {}) => {
  var _a, _b, _c, _d, _e;
  if (!data)
    return;
  const { contract, skipGraph = true } = options;
  const labels = name.split(".");
  const isEth = labels[labels.length - 1] === "eth";
  const is2LD = labels.length === 2;
  if (contract || labels.length === 1) {
    const singleOwner = singleContractOwnerDecode(data);
    const obj = {
      ownershipLevel: contract || "registry"
    };
    if (contract === "registrar") {
      return {
        ...obj,
        registrant: singleOwner
      };
    }
    return {
      ...obj,
      owner: singleOwner
    };
  }
  const result = await multicallWrapper.decode(data);
  if (!result)
    return;
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  const decodedData = [result[0][1], result[1][1], (_a = result[2]) == null ? void 0 : _a[1]].map(
    (ret) => ret && ret !== "0x" && import_abi.defaultAbiCoder.decode(["address"], ret)
  );
  const registryOwner = decodedData[0][0];
  const nameWrapperOwner = decodedData[1][0];
  let registrarOwner = (_b = decodedData[2]) == null ? void 0 : _b[0];
  let baseReturnObject = {};
  if (isEth) {
    let graphErrors;
    if (is2LD) {
      if (!registrarOwner && !skipGraph) {
        const graphRegistrantResult = await gqlInstance.client.request(registrantQuery, {
          namehash: (0, import_normalise.namehash)(name)
        }).catch((e) => {
          console.error(e);
          graphErrors = (0, import_errors.getClientErrors)(e);
          return void 0;
        }).finally(import_errors.debugSubgraphLatency);
        registrarOwner = (_e = (_d = (_c = graphRegistrantResult == null ? void 0 : graphRegistrantResult.domain) == null ? void 0 : _c.registration) == null ? void 0 : _d.registrant) == null ? void 0 : _e.id;
        baseReturnObject = {
          expired: true
        };
      } else {
        baseReturnObject = {
          expired: !registrarOwner
        };
      }
    }
    if (baseReturnObject.expired && (registryOwner == null ? void 0 : registryOwner.toLowerCase()) === nameWrapper.address.toLowerCase()) {
      const owner = {
        owner: nameWrapperOwner,
        ownershipLevel: "nameWrapper",
        ...baseReturnObject
      };
      if (graphErrors) {
        throw new import_errors.ENSJSError({
          data: owner,
          errors: graphErrors
        });
      }
      return owner;
    }
    if ((registrarOwner == null ? void 0 : registrarOwner.toLowerCase()) === nameWrapper.address.toLowerCase()) {
      const owner = {
        owner: nameWrapperOwner,
        ownershipLevel: "nameWrapper",
        ...baseReturnObject
      };
      if (graphErrors) {
        throw new import_errors.ENSJSError({
          data: owner,
          errors: graphErrors
        });
      }
      return owner;
    }
    if (registrarOwner) {
      const owner = {
        registrant: registrarOwner,
        owner: registryOwner,
        ownershipLevel: "registrar",
        ...baseReturnObject
      };
      if (graphErrors) {
        throw new import_errors.ENSJSError({
          data: owner,
          errors: graphErrors
        });
      }
      return owner;
    }
    if ((0, import_bytes.hexStripZeros)(registryOwner) !== "0x") {
      if (labels.length === 2) {
        const owner = {
          registrant: void 0,
          owner: registryOwner,
          ownershipLevel: "registrar",
          expired: true
        };
        if (graphErrors) {
          throw new import_errors.ENSJSError({
            data: owner,
            errors: graphErrors
          });
        }
        return owner;
      }
      if (registryOwner === nameWrapper.address && nameWrapperOwner && (0, import_bytes.hexStripZeros)(nameWrapperOwner) !== "0x") {
        return {
          owner: nameWrapperOwner,
          ownershipLevel: "nameWrapper"
        };
      }
      return {
        owner: registryOwner,
        ownershipLevel: "registry"
      };
    }
    if (graphErrors) {
      throw new import_errors.ENSJSError({
        errors: graphErrors
      });
    }
    return void 0;
  }
  if (registryOwner === nameWrapper.address && nameWrapperOwner && (0, import_bytes.hexStripZeros)(nameWrapperOwner) !== "0x") {
    return {
      owner: nameWrapperOwner,
      ownershipLevel: "nameWrapper"
    };
  }
  if ((0, import_bytes.hexStripZeros)(registryOwner) !== "0x") {
    return {
      owner: registryOwner,
      ownershipLevel: "registry"
    };
  }
  return;
};
var getOwner_default = { raw, decode };
