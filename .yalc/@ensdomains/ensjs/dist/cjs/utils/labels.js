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
var labels_exports = {};
__export(labels_exports, {
  checkIsDecrypted: () => checkIsDecrypted,
  checkLabel: () => checkLabel,
  checkLocalStorageSize: () => checkLocalStorageSize,
  decodeLabelhash: () => decodeLabelhash,
  decryptName: () => decryptName,
  encodeLabel: () => encodeLabel,
  encodeLabelhash: () => encodeLabelhash,
  getEncryptedLabelAmount: () => getEncryptedLabelAmount,
  isEncodedLabelhash: () => isEncodedLabelhash,
  keccakFromString: () => keccakFromString,
  labelhash: () => labelhash,
  parseName: () => parseName,
  saveLabel: () => saveLabel,
  saveName: () => saveName,
  truncateUndecryptedName: () => truncateUndecryptedName
});
module.exports = __toCommonJS(labels_exports);
var import_solidity = require("@ethersproject/solidity");
var import_format = require("./format");
const hasLocalStorage = typeof localStorage !== "undefined";
const labelhash = (input) => (0, import_solidity.keccak256)(["string"], [input]);
const keccakFromString = (input) => labelhash(input);
function decodeLabelhash(hash) {
  if (!(hash.startsWith("[") && hash.endsWith("]"))) {
    throw Error(
      "Expected encoded labelhash to start and end with square brackets"
    );
  }
  if (hash.length !== 66) {
    throw Error("Expected encoded labelhash to have a length of 66");
  }
  return `0x${hash.slice(1, -1)}`;
}
function encodeLabelhash(hash) {
  if (!hash.startsWith("0x")) {
    throw new Error("Expected label hash to start with 0x");
  }
  if (hash.length !== 66) {
    throw new Error("Expected label hash to have a length of 66");
  }
  return `[${hash.slice(2)}]`;
}
function isEncodedLabelhash(hash) {
  return hash.startsWith("[") && hash.endsWith("]") && hash.length === 66;
}
function getLabels() {
  return hasLocalStorage ? JSON.parse(localStorage.getItem("ensjs:labels")) || {} : {};
}
function _saveLabel(hash, label) {
  if (!hasLocalStorage)
    return hash;
  const labels = getLabels();
  localStorage.setItem(
    "ensjs:labels",
    JSON.stringify({
      ...labels,
      [hash]: label
    })
  );
  return hash;
}
function saveLabel(label) {
  const hash = `${labelhash(label.toLowerCase())}`;
  return _saveLabel(hash, label);
}
function saveName(name) {
  const nameArray = name.split(".");
  for (const label of nameArray) {
    if (!isEncodedLabelhash(label)) {
      saveLabel(label);
    }
  }
}
function checkLabel(hash) {
  const labels = getLabels();
  if (isEncodedLabelhash(hash)) {
    return labels[decodeLabelhash(hash)] || hash;
  }
  return hash;
}
function encodeLabel(label) {
  try {
    return encodeLabelhash(label);
  } catch {
    return label;
  }
}
function parseName(name) {
  const nameArray = name.split(".");
  return nameArray.map((label) => encodeLabel(label)).join(".");
}
function checkIsDecrypted(string) {
  return !(string == null ? void 0 : string.includes("["));
}
function decryptName(name) {
  return name.split(".").map((label) => checkLabel(label)).join(".");
}
const truncateUndecryptedName = (name) => (0, import_format.truncateFormat)(name);
function checkLocalStorageSize() {
  if (!hasLocalStorage)
    return "Empty (0 KB)";
  let allStrings = "";
  for (const key in window.localStorage) {
    if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
      allStrings += window.localStorage[key];
    }
  }
  return allStrings ? `${3 + allStrings.length * 16 / (8 * 1024)} KB` : "Empty (0 KB)";
}
const encodedLabelRegex = /\[[a-fA-F0-9]{64}\]/g;
const getEncryptedLabelAmount = (name) => {
  var _a;
  return ((_a = name.match(encodedLabelRegex)) == null ? void 0 : _a.length) || 0;
};
