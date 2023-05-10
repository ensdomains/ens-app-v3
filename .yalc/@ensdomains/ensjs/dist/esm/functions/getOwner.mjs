// src/functions/getOwner.ts
import { defaultAbiCoder } from "@ethersproject/abi";
import { hexStripZeros } from "@ethersproject/bytes";
import { labelhash } from "../utils/labels.mjs";
import { namehash as makeNamehash } from "../utils/normalise.mjs";
import { checkIsDotEth } from "../utils/validation.mjs";
import { returnOrThrow } from "../utils/errors.mjs";
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
var raw = async ({ contracts, multicallWrapper }, name, options = {}) => {
  const { contract } = options;
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
  if (checkIsDotEth(labels)) {
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
  gqlInstance,
  provider
}, data, name, options = {}) => {
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
  const nameWrapper = await contracts?.getNameWrapper();
  const decodedData = [result[0][1], result[1][1], result[2]?.[1]].map(
    (ret) => ret && ret !== "0x" && defaultAbiCoder.decode(["address"], ret)
  );
  const registryOwner = decodedData[0][0];
  const nameWrapperOwner = decodedData[1][0];
  let registrarOwner = decodedData[2]?.[0];
  let baseReturnObject = {};
  console.log("owners", registryOwner, nameWrapperOwner, registrarOwner);
  if (isEth) {
    let meta;
    if (is2LD) {
      if (!registrarOwner && !skipGraph) {
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
        meta = graphRegistrantResult._meta;
      } else {
        baseReturnObject = {
          expired: !registrarOwner
        };
      }
    }
    if (registrarOwner?.toLowerCase() === nameWrapper.address.toLowerCase()) {
      return returnOrThrow(
        {
          owner: nameWrapperOwner,
          ownershipLevel: "nameWrapper",
          ...baseReturnObject
        },
        meta,
        provider
      );
    }
    if (registrarOwner) {
      return returnOrThrow(
        {
          registrant: registrarOwner,
          owner: registryOwner,
          ownershipLevel: "registrar",
          ...baseReturnObject
        },
        meta,
        provider
      );
    }
    if (hexStripZeros(registryOwner) !== "0x") {
      if (labels.length === 2) {
        return returnOrThrow(
          {
            registrant: void 0,
            owner: registryOwner,
            ownershipLevel: "registrar",
            expired: true
          },
          meta,
          provider
        );
      }
      if (registryOwner === nameWrapper.address && nameWrapperOwner && hexStripZeros(nameWrapperOwner) !== "0x") {
        return returnOrThrow(
          {
            owner: nameWrapperOwner,
            ownershipLevel: "nameWrapper"
          },
          meta,
          provider
        );
      }
      return returnOrThrow(
        {
          owner: registryOwner,
          ownershipLevel: "registry"
        },
        meta,
        provider
      );
    }
    return returnOrThrow(void 0, meta, provider);
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
