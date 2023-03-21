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
var DefaultReverseResolver_factory_exports = {};
__export(DefaultReverseResolver_factory_exports, {
  DefaultReverseResolver__factory: () => DefaultReverseResolver__factory
});
module.exports = __toCommonJS(DefaultReverseResolver_factory_exports);
var import_abi = require("@ethersproject/abi");
var import_contracts = require("@ethersproject/contracts");
const _abi = [
  {
    inputs: [
      {
        internalType: "contract ENS",
        name: "ensAddr",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
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
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
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
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "_name",
        type: "string"
      }
    ],
    name: "setName",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
class DefaultReverseResolver__factory {
  static createInterface() {
    return new import_abi.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new import_contracts.Contract(
      address,
      _abi,
      signerOrProvider
    );
  }
}
DefaultReverseResolver__factory.abi = _abi;
