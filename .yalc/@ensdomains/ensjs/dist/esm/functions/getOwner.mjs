// src/functions/getOwner.ts
import { ethers } from "ethers";
import { labelhash } from "../utils/labels.mjs";
import { namehash as makeNamehash } from "../utils/normalise.mjs";
var singleContractOwnerRaw = async ({ contracts }, contract, namehash, labels) => {
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
          labelhash(labels[0])
        ])
      };
    }
  }
};
var raw = async ({ contracts, multicallWrapper }, name, contract) => {
  const namehash = makeNamehash(name);
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
var singleContractOwnerDecode = (data) => ethers.utils.defaultAbiCoder.decode(["address"], data)[0];
var decode = async ({ contracts, multicallWrapper }, data, name, contract) => {
  if (!data)
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
  if (!result)
    return;
  const nameWrapper = await contracts?.getNameWrapper();
  const decodedData = [result[0][1], result[1][1], result[2]?.[1]].map(
    (ret) => ret && ret !== "0x" && ethers.utils.defaultAbiCoder.decode(["address"], ret)
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
    if (labels.length > 2 && ethers.utils.hexStripZeros(registryOwner) !== "0x") {
      if (registryOwner === nameWrapper.address && nameWrapperOwner && ethers.utils.hexStripZeros(nameWrapperOwner) !== "0x") {
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
  if (registryOwner === nameWrapper.address && nameWrapperOwner && ethers.utils.hexStripZeros(nameWrapperOwner) !== "0x") {
    return {
      owner: nameWrapperOwner,
      ownershipLevel: "nameWrapper"
    };
  }
  if (ethers.utils.hexStripZeros(registryOwner) !== "0x") {
    return {
      owner: registryOwner,
      ownershipLevel: "registry"
    };
  }
  return;
};
var getOwner_default = { raw, decode };
export {
  getOwner_default as default
};
