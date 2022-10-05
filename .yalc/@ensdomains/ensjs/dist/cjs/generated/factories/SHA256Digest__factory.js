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
var SHA256Digest_factory_exports = {};
__export(SHA256Digest_factory_exports, {
  SHA256Digest__factory: () => SHA256Digest__factory
});
module.exports = __toCommonJS(SHA256Digest_factory_exports);
var import_ethers = require("ethers");
const _abi = [
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
class SHA256Digest__factory {
  static abi = _abi;
  static createInterface() {
    return new import_ethers.utils.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers.Contract(address, _abi, signerOrProvider);
  }
}
