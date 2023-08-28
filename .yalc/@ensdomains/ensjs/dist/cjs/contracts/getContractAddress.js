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
var getContractAddress_exports = {};
__export(getContractAddress_exports, {
  getContractAddress: () => getContractAddress
});
module.exports = __toCommonJS(getContractAddress_exports);
const addresses = {
  BaseRegistrarImplementation: {
    "1": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    "5": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    "11155111": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
  },
  DNSRegistrar: {
    "1": "0x58774Bb8acD458A640aF0B88238369A167546ef2",
    "5": "0x8edc487D26F6c8Fa76e032066A3D4F87E273515d"
  },
  ETHRegistrarController: {
    "1": "0x253553366Da8546fC250F225fe3d25d0C782303b",
    "5": "0xCc5e7dB10E65EED1BBD105359e7268aa660f6734",
    "11155111": "0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72"
  },
  Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  NameWrapper: {
    "1": "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401",
    "5": "0x114D4603199df73e7D157787f8778E21fCd13066",
    "11155111": "0x0635513f179D50A207757E05759CbD106d7dFcE8"
  },
  PublicResolver: {
    "1": "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63",
    "5": "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750",
    "11155111": "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD"
  },
  ENSRegistry: {
    "1": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    "5": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    "11155111": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  ReverseRegistrar: {
    "1": "0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb",
    "5": "0x4f7A657451358a22dc397d5eE7981FfC526cd856",
    "11155111": "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6"
  },
  UniversalResolver: {
    "1": "0xc0497e381f536be9ce14b0dd3817cbcae57d2f62",
    "5": "0x56522d00c410a43bffdf00a9a569489297385790",
    "11155111": "0x21B000Fd62a880b2125A61e36a284BB757b76025"
  },
  BulkRenewal: {
    "1": "0xa12159e5131b1eEf6B4857EEE3e1954744b5033A",
    "5": "0xeA64C81d0d718620daBC02D61f3B255C641f475F",
    "11155111": "0x4EF77b90762Eddb33C8Eba5B5a19558DaE53D7a1"
  }
};
const getContractAddress = (networkId) => (contractName) => {
  try {
    return typeof addresses[contractName] === "string" ? addresses[contractName] : addresses[contractName][networkId];
  } catch {
    throw new Error(
      `No address for contract ${contractName} on network ${networkId}`
    );
  }
};
