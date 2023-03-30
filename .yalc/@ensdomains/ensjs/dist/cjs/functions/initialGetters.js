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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var initialGetters_exports = {};
__export(initialGetters_exports, {
  batch: () => import_batch.default,
  getExpiry: () => import_getExpiry.default,
  getName: () => import_getName.default,
  getNames: () => import_getNames.default,
  getOwner: () => import_getOwner.default,
  getPrice: () => import_getPrice.default,
  getProfile: () => import_getProfile.default,
  getRecords: () => import_getRecords.default,
  getSubnames: () => import_getSubnames.default,
  supportsTLD: () => import_supportsTLD.default
});
module.exports = __toCommonJS(initialGetters_exports);
var import_batch = __toESM(require("./batch"));
__reExport(initialGetters_exports, require("./batchWrappers"), module.exports);
var import_getExpiry = __toESM(require("./getExpiry"));
var import_getName = __toESM(require("./getName"));
var import_getNames = __toESM(require("./getNames"));
var import_getOwner = __toESM(require("./getOwner"));
var import_getPrice = __toESM(require("./getPrice"));
var import_getProfile = __toESM(require("./getProfile"));
var import_getRecords = __toESM(require("./getRecords"));
__reExport(initialGetters_exports, require("./getSpecificRecord"), module.exports);
var import_getSubnames = __toESM(require("./getSubnames"));
var import_supportsTLD = __toESM(require("./supportsTLD"));
