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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var batchWrappers_exports = {};
__export(batchWrappers_exports, {
  multicallWrapper: () => multicallWrapper,
  resolverMulticallWrapper: () => resolverMulticallWrapper,
  universalWrapper: () => universalWrapper
});
module.exports = __toCommonJS(batchWrappers_exports);
var import_ccip = __toESM(require("../utils/ccip"));
var import_hexEncodedName = require("../utils/hexEncodedName");
const universalWrapper = {
  raw: async ({ contracts }, name, data) => {
    const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
    return {
      to: universalResolver.address,
      data: universalResolver.interface.encodeFunctionData(
        "resolve(bytes,bytes)",
        [(0, import_hexEncodedName.hexEncodeName)(name), data]
      )
    };
  },
  decode: async ({ contracts }, data) => {
    const universalResolver = await (contracts == null ? void 0 : contracts.getUniversalResolver());
    const response = universalResolver.interface.decodeFunctionResult(
      "resolve(bytes,bytes)",
      data
    );
    if (!response || !response[0]) {
      return;
    }
    return { data: response[0], resolver: response[1] };
  }
};
const resolverMulticallWrapper = {
  raw: async ({ contracts }, data) => {
    const publicResolver = await (contracts == null ? void 0 : contracts.getPublicResolver());
    const formattedDataArr = data.map((item) => item.data);
    return {
      to: publicResolver.address,
      data: publicResolver.interface.encodeFunctionData("multicall", [
        formattedDataArr
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    const publicResolver = await (contracts == null ? void 0 : contracts.getPublicResolver());
    const response = publicResolver.interface.decodeFunctionResult(
      "multicall",
      data
    );
    if (!response) {
      return;
    }
    return response;
  }
};
const multicallWrapper = {
  async raw({ contracts }, transactions, requireSuccess = false) {
    const multicall = await (contracts == null ? void 0 : contracts.getMulticall());
    return {
      to: multicall.address,
      data: multicall.interface.encodeFunctionData("tryAggregate", [
        requireSuccess,
        transactions.map((tx) => ({
          target: tx.to,
          callData: tx.data
        }))
      ])
    };
  },
  async decode({ contracts, provider }, data, transactions) {
    if (!data)
      return;
    const multicall = await (contracts == null ? void 0 : contracts.getMulticall());
    try {
      const [result] = multicall.interface.decodeFunctionResult(
        "tryAggregate",
        data
      );
      const ccipChecked = await Promise.all(
        result.map(
          async ([success, returnData], i) => {
            let newArr = [success, returnData];
            if (!success && returnData.startsWith("0x556f1830")) {
              try {
                const newData = await (0, import_ccip.default)(
                  provider,
                  transactions[i],
                  returnData
                );
                if (newData) {
                  newArr = [true, newData];
                }
              } catch {
              }
            }
            return {
              ...newArr,
              success: newArr[0],
              returnData: newArr[1]
            };
          }
        )
      );
      return ccipChecked;
    } catch (e) {
      console.error(e);
      return;
    }
  }
};
