"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var normalise_exports = {};
__export(normalise_exports, {
  namehash: () => namehash,
  normalise: () => normalise
});
module.exports = __toCommonJS(normalise_exports);
var import_utils = require("ethers/lib/utils");
var import_uts46bundle = __toESM(require("idna-uts46-hx/uts46bundle.js"));
var import_labels = require("./labels");
const zeros = new Uint8Array(32);
zeros.fill(0);
const normalise = (name) => name ? import_uts46bundle.default.toUnicode(name, { useStd3ASCII: true }) : name;
const namehash = (name) => {
  let result = zeros;
  if (name) {
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      let labelSha;
      if ((0, import_labels.isEncodedLabelhash)(labels[i])) {
        labelSha = (0, import_labels.decodeLabelhash)(labels[i]);
      } else {
        const normalised = normalise(labels[i]);
        labelSha = (0, import_utils.keccak256)((0, import_utils.toUtf8Bytes)(normalised));
      }
      result = (0, import_utils.keccak256)((0, import_utils.concat)([result, labelSha]));
    }
  } else {
    result = (0, import_utils.hexlify)(zeros);
  }
  return result;
};
