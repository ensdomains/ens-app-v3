// src/utils/labels.ts
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { truncateFormat } from "./format.mjs";
var hasLocalStorage = typeof localStorage !== "undefined";
var labelhash = (input) => solidityKeccak256(["string"], [input]);
var keccakFromString = (input) => labelhash(input);
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
  return !string?.includes("[");
}
function decryptName(name) {
  return name.split(".").map((label) => checkLabel(label)).join(".");
}
var truncateUndecryptedName = (name) => truncateFormat(name);
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
var encodedLabelRegex = /\[[a-fA-F0-9]{64}\]/g;
var getEncryptedLabelAmount = (name) => name.match(encodedLabelRegex)?.length || 0;
export {
  checkIsDecrypted,
  checkLabel,
  checkLocalStorageSize,
  decodeLabelhash,
  decryptName,
  encodeLabel,
  encodeLabelhash,
  getEncryptedLabelAmount,
  isEncodedLabelhash,
  keccakFromString,
  labelhash,
  parseName,
  saveLabel,
  saveName,
  truncateUndecryptedName
};
