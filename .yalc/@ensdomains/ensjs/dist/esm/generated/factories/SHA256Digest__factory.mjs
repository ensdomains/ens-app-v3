var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/generated/factories/SHA256Digest__factory.ts
import { Contract, utils } from "ethers";
var _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  }
];
var SHA256Digest__factory = class {
  static createInterface() {
    return new utils.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
};
__publicField(SHA256Digest__factory, "abi", _abi);
export {
  SHA256Digest__factory
};
