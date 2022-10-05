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
var import_ethers = require("ethers");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
const singleContractOwnerRaw = async ({ contracts }, contract, namehash, labels) => {
  switch (contract) {
    case "nameWrapper": {
      const nameWrapper = await contracts?.getNameWrapper();
      return {
        to: nameWrapper.address,
        data: nameWrapper.interface.encodeFunctionData("ownerOf", [namehash])
      };
    }
    case "registry": {
      const registry = await contracts?.getRegistry();
      return {
        to: registry.address,
        data: registry.interface.encodeFunctionData("owner", [namehash])
      };
    }
    case "registrar": {
      const registrar = await contracts?.getBaseRegistrar();
      return {
        to: registrar.address,
        data: registrar.interface.encodeFunctionData("ownerOf", [
          (0, import_labels.labelhash)(labels[0])
        ])
      };
    }
  }
};
const raw = async ({ contracts, multicallWrapper }, name, contract) => {
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
  if (labels.length === 2 && labels[1] === "eth") {
    data.push(registrarData);
  }
  return multicallWrapper.raw(data);
};
const singleContractOwnerDecode = (data) => import_ethers.ethers.utils.defaultAbiCoder.decode(["address"], data)[0];
const decode = async ({ contracts, multicallWrapper }, data, name, contract) => {
  if (data === null)
    return;
  const labels = name.split(".");
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
  if (result === null)
    return;
  const nameWrapper = await contracts?.getNameWrapper();
  const decodedData = [result[0][1], result[1][1], result[2]?.[1]].map(
    (ret) => ret && ret !== "0x" && import_ethers.ethers.utils.defaultAbiCoder.decode(["address"], ret)
  );
  const registryOwner = decodedData[0][0];
  const nameWrapperOwner = decodedData[1][0];
  const registrarOwner = decodedData[2]?.[0];
  if (labels[labels.length - 1] === "eth") {
    if (registrarOwner === nameWrapper.address) {
      return {
        owner: nameWrapperOwner,
        ownershipLevel: "nameWrapper"
      };
    }
    if (registrarOwner) {
      return {
        registrant: registrarOwner,
        owner: registryOwner,
        ownershipLevel: "registrar"
      };
    }
    if (labels.length > 2 && import_ethers.ethers.utils.hexStripZeros(registryOwner) !== "0x") {
      if (registryOwner === nameWrapper.address && import_ethers.ethers.utils.hexStripZeros(nameWrapperOwner) !== "0x") {
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
    return;
  }
  if (registryOwner === nameWrapper.address && import_ethers.ethers.utils.hexStripZeros(nameWrapperOwner) !== "0x") {
    return {
      owner: nameWrapperOwner,
      ownershipLevel: "nameWrapper"
    };
  }
  if (import_ethers.ethers.utils.hexStripZeros(registryOwner) !== "0x") {
    return {
      owner: registryOwner,
      ownershipLevel: "registry"
    };
  }
  return;
};
var getOwner_default = { raw, decode };
