var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/generated/factories/Root__factory.ts
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
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32"
      }
    ],
    name: "TLDLocked",
    type: "event"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "controllers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ens",
    outputs: [
      {
        internalType: "contract ENS",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address"
      }
    ],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32"
      }
    ],
    name: "lock",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "locked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "controller",
        type: "address"
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool"
      }
    ],
    name: "setController",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "resolver",
        type: "address"
      }
    ],
    name: "setResolver",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "setSubnodeOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
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
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
var Root__factory = class {
  static createInterface() {
    return new Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
};
__publicField(Root__factory, "abi", _abi);
export {
  Root__factory
};
