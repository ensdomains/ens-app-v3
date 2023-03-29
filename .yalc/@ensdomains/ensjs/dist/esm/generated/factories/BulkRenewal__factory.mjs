var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/generated/factories/BulkRenewal__factory.ts
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
var _abi = [
  {
    inputs: [
      {
        internalType: "contract ENS",
        name: "_ens",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "ens",
    outputs: [
      {
        internalType: "contract ENS",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "names",
        type: "string[]"
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256"
      }
    ],
    name: "renewAll",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "names",
        type: "string[]"
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256"
      }
    ],
    name: "rentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
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
var BulkRenewal__factory = class {
  static createInterface() {
    return new Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
};
__publicField(BulkRenewal__factory, "abi", _abi);
export {
  BulkRenewal__factory
};
