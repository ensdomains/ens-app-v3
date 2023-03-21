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
var singleCall_exports = {};
__export(singleCall_exports, {
  default: () => singleCall_default
});
module.exports = __toCommonJS(singleCall_exports);
var singleCall_default = async (provider, ensData, func, ...data) => {
  const { passthrough, ...rawData } = await func.raw(ensData, ...data);
  const result = await provider.call({ ...rawData, ccipReadEnabled: true }).catch(() => null);
  if (!result)
    return;
  if (passthrough)
    return func.decode(ensData, result, passthrough, ...data);
  return func.decode(ensData, result, ...data);
};
