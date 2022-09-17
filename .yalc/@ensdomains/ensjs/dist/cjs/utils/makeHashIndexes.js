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
var makeHashIndexes_exports = {};
__export(makeHashIndexes_exports, {
  makeNamehashIndexes: () => makeNamehashIndexes,
  makeOtherIndexes: () => makeOtherIndexes
});
module.exports = __toCommonJS(makeHashIndexes_exports);
var import_normalise = require("./normalise");
const makeOtherIndexes = (data, findStr) => Array.from(data.matchAll(findStr)).map((x) => x.index / 2 - 1);
const makeNamehashIndexes = (data, name) => Array.from(data.matchAll((0, import_normalise.namehash)(name).substring(2))).map(
  (x) => x.index / 2 - 1
);
