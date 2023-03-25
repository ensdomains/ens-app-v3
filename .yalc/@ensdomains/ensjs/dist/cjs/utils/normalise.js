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
var normalise_exports = {};
__export(normalise_exports, {
  beautify: () => beautify,
  emoji: () => emoji,
  isCombiningMark: () => isCombiningMark,
  namehash: () => namehash,
  normalise: () => normalise,
  normalizeFragment: () => normalizeFragment,
  shouldEscape: () => shouldEscape,
  split: () => split,
  tokenise: () => tokenise
});
module.exports = __toCommonJS(normalise_exports);
var import_ens_normalize = require("@adraffy/ens-normalize");
var import_bytes = require("@ethersproject/bytes");
var import_keccak256 = require("@ethersproject/keccak256");
var import_strings = require("@ethersproject/strings");
var import_labels = require("./labels");
const zeros = new Uint8Array(32);
zeros.fill(0);
const normalise = (name) => name ? (0, import_ens_normalize.ens_normalize)(name) : name;
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
        labelSha = (0, import_keccak256.keccak256)((0, import_strings.toUtf8Bytes)(normalised));
      }
      result = (0, import_keccak256.keccak256)((0, import_bytes.concat)([result, labelSha]));
    }
  } else {
    result = (0, import_bytes.hexlify)(zeros);
  }
  return result;
};
const beautify = import_ens_normalize.ens_beautify;
const emoji = import_ens_normalize.ens_emoji;
const normalizeFragment = import_ens_normalize.ens_normalize_fragment;
const split = import_ens_normalize.ens_split;
const tokenise = import_ens_normalize.ens_tokenize;
const isCombiningMark = import_ens_normalize.is_combining_mark;
const shouldEscape = import_ens_normalize.should_escape;
