var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/generated/factories/TLDPublicSuffixList__factory.ts
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
var _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes"
      }
    ],
    name: "isPublicSuffix",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var TLDPublicSuffixList__factory = class {
  static createInterface() {
    return new Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
};
__publicField(TLDPublicSuffixList__factory, "abi", _abi);
export {
  TLDPublicSuffixList__factory
};
