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
var batch_exports = {};
__export(batch_exports, {
  default: () => batch_default
});
module.exports = __toCommonJS(batch_exports);
const raw = async ({ multicallWrapper }, ...items) => {
  const rawDataArr = await Promise.all(
    items.map(({ args, raw: rawRef }, i) => {
      if (!rawRef) {
        throw new Error(`Function ${i} is not batchable`);
      }
      return rawRef(...args);
    })
  );
  return multicallWrapper.raw(rawDataArr);
};
const decode = async ({ multicallWrapper }, data, ...items) => {
  const response = await multicallWrapper.decode(data);
  if (!response)
    return;
  return Promise.all(
    response.map(
      (ret, i) => items[i].decode(ret.returnData, ...items[i].args)
    )
  );
};
var batch_default = {
  raw,
  decode
};
