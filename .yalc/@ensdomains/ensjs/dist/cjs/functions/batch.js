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
var import_errors = require("../utils/errors");
const raw = async ({ multicallWrapper }, ...items) => {
  const rawDataArr = await Promise.all(
    items.map(({ args, raw: rawRef }, i) => {
      if (!rawRef) {
        throw new Error(`Function ${i} is not batchable`);
      }
      return rawRef(...args);
    })
  );
  const response = await multicallWrapper.raw(rawDataArr);
  return { ...response, passthrough: rawDataArr };
};
const decode = async ({ multicallWrapper }, data, passthrough, ...items) => {
  const response = await multicallWrapper.decode(data, passthrough);
  if (!response)
    return;
  const results = await Promise.allSettled(
    response.map((ret, i) => {
      if (passthrough[i].passthrough) {
        return items[i].decode(
          ret.returnData,
          passthrough[i].passthrough,
          ...items[i].args
        );
      }
      return items[i].decode(ret.returnData, ...items[i].args);
    })
  );
  const reducedResults = results.reduce(
    (acc, result) => {
      if (result.status === "fulfilled") {
        return { ...acc, data: [...acc.data, result.value] };
      }
      const error = result.reason instanceof import_errors.ENSJSError ? result.reason : void 0;
      const itemData = error == null ? void 0 : error.data;
      const itemErrors = (error == null ? void 0 : error.errors) || [{ message: "unknown_error" }];
      return {
        errors: [...acc.errors, ...itemErrors],
        data: [...acc.data, itemData]
      };
    },
    { data: [], errors: [] }
  );
  if (reducedResults.errors.length)
    throw new import_errors.ENSJSError({
      data: reducedResults.data,
      errors: reducedResults.errors
    });
  return reducedResults.data;
};
var batch_default = {
  raw,
  decode
};
