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
var TLDPublicSuffixList_factory_exports = {};
__export(TLDPublicSuffixList_factory_exports, {
  TLDPublicSuffixList__factory: () => TLDPublicSuffixList__factory
});
module.exports = __toCommonJS(TLDPublicSuffixList_factory_exports);
var import_abi = require("@ethersproject/abi");
var import_contracts = require("@ethersproject/contracts");
const _abi = [
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
class TLDPublicSuffixList__factory {
  static createInterface() {
    return new import_abi.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new import_contracts.Contract(address, _abi, signerOrProvider);
  }
}
TLDPublicSuffixList__factory.abi = _abi;
