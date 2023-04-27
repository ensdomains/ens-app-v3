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
var validation_exports = {};
__export(validation_exports, {
  checkIsDotEth: () => checkIsDotEth,
  parseInput: () => parseInput,
  validateName: () => validateName
});
module.exports = __toCommonJS(validation_exports);
var import_consts = require("./consts");
var import_labels = require("./labels");
var import_normalise = require("./normalise");
const validateName = (name) => {
  const nameArray = name.split(".");
  const normalisedArray = nameArray.map((label) => {
    if (label.length === 0)
      throw new Error("Name cannot have empty labels");
    if (label === "[root]") {
      if (name !== label)
        throw new Error("Root label must be the only label");
      return label;
    }
    return (0, import_labels.isEncodedLabelhash)(label) ? (0, import_labels.checkLabel)(label) || label : (0, import_normalise.normalise)(label);
  });
  const normalisedName = normalisedArray.join(".");
  (0, import_labels.saveName)(normalisedName);
  return normalisedName;
};
const parseInput = (input) => {
  var _a;
  let nameReference = input;
  let isValid = false;
  try {
    nameReference = validateName(input);
    isValid = true;
  } catch {
  }
  const normalisedName = isValid ? nameReference : void 0;
  const labels = nameReference.split(".");
  const tld = labels[labels.length - 1];
  const isETH = tld === "eth";
  const labelDataArray = (0, import_normalise.split)(nameReference);
  const isShort = (((_a = labelDataArray[0].output) == null ? void 0 : _a.length) || 0) < import_consts.MINIMUM_DOT_ETH_CHARS;
  if (labels.length === 1) {
    return {
      type: "label",
      normalised: normalisedName,
      isShort,
      isValid,
      is2LD: false,
      isETH,
      labelDataArray
    };
  }
  const is2LD = labels.length === 2;
  return {
    type: "name",
    normalised: normalisedName,
    isShort: isETH && is2LD ? isShort : false,
    isValid,
    is2LD,
    isETH,
    labelDataArray
  };
};
const checkIsDotEth = (labels) => labels.length === 2 && labels[1] === "eth";
