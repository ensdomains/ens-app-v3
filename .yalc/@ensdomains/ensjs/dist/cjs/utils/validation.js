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
  parseInputType: () => parseInputType,
  validateName: () => validateName,
  validateTLD: () => validateTLD
});
module.exports = __toCommonJS(validation_exports);
var import_utils = require("ethers/lib/utils");
var import_labels = require("./labels");
var import_normalise = require("./normalise");
const validateName = (name) => {
  const nameArray = name.split(".");
  const hasEmptyLabels = nameArray.some((label) => label.length === 0);
  if (hasEmptyLabels)
    throw new Error("Name cannot have empty labels");
  const normalizedArray = nameArray.map((label) => {
    if (label === "[root]") {
      return label;
    }
    return (0, import_labels.isEncodedLabelhash)(label) ? label : (0, import_normalise.normalise)(label);
  });
  const normalizedName = normalizedArray.join(".");
  (0, import_labels.saveName)(normalizedName);
  return normalizedName;
};
const validateTLD = (name) => {
  const labels = name.split(".");
  return validateName(labels[labels.length - 1]);
};
const parseInputType = (input) => {
  const validTLD = validateTLD(input);
  const regex = /[^.]+$/;
  try {
    validateName(input);
  } catch (e) {
    return {
      type: "unknown"
    };
  }
  if (input.indexOf(".") !== -1) {
    const termArray = input.split(".");
    const tld = input.match(regex) ? input.match(regex)[0] : "";
    if (validTLD) {
      if (tld === "eth" && [...termArray[termArray.length - 2]].length < 3) {
        return {
          type: "name",
          info: "short"
        };
      }
      return {
        type: "name",
        info: "supported"
      };
    }
    return {
      type: "name",
      info: "unsupported"
    };
  }
  if ((0, import_utils.isAddress)(input)) {
    return {
      type: "address"
    };
  }
  return {
    type: "label"
  };
};
