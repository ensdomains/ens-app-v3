// src/functions/getOwner.ts
import { defaultAbiCoder } from "@ethersproject/abi/lib.esm/abi-coder.js";
import { hexStripZeros } from "@ethersproject/bytes";
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
var registrantQuery = `
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
var singleContractOwnerDecode = (data) => defaultAbiCoder.decode(["address"], data)[0];
var decode = async ({
  contracts,
  multicallWrapper,
  gqlInstance
}, data, name, contract) => {
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
    (ret) => ret && ret !== "0x" && defaultAbiCoder.decode(["address"], ret)
  );
  const registryOwner = decodedData[0][0];
  const nameWrapperOwner = decodedData[1][0];
  let registrarOwner = decodedData[2]?.[0];
  let baseReturnObject = {};
  if (labels[labels.length - 1] === "eth") {
    if (labels.length === 2) {
      if (!registrarOwner) {
        const graphRegistrantResult = await gqlInstance.client.request(
          registrantQuery,
          {
            namehash: makeNamehash(name)
          }
        );
        registrarOwner = graphRegistrantResult.domain?.registration?.registrant?.id;
        baseReturnObject = {
          expired: true
        };
      } else {
        baseReturnObject = {
          expired: false
        };
      }
    }
    if (registrarOwner?.toLowerCase() === nameWrapper.address.toLowerCase()) {
      return {
        owner: nameWrapperOwner,
        ownershipLevel: "nameWrapper",
        ...baseReturnObject
      };
    }
    if (registrarOwner) {
      return {
        registrant: registrarOwner,
        owner: registryOwner,
        ownershipLevel: "registrar",
        ...baseReturnObject
      };
    }
    if (hexStripZeros(registryOwner) !== "0x") {
      if (labels.length === 2) {
        return {
          registrant: void 0,
          owner: registryOwner,
          ownershipLevel: "registrar",
          expired: true
        };
      }
      if (registryOwner === nameWrapper.address && nameWrapperOwner && hexStripZeros(nameWrapperOwner) !== "0x") {
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
  if (registryOwner === nameWrapper.address && nameWrapperOwner && hexStripZeros(nameWrapperOwner) !== "0x") {
    return {
      owner: nameWrapperOwner,
      ownershipLevel: "nameWrapper"
    };
  }
  if (hexStripZeros(registryOwner) !== "0x") {
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
