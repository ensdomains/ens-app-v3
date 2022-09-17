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
var getSpecificRecord_exports = {};
__export(getSpecificRecord_exports, {
  _getAddr: () => _getAddr,
  _getContentHash: () => _getContentHash,
  _getText: () => _getText,
  getAddr: () => getAddr,
  getContentHash: () => getContentHash,
  getText: () => getText
});
module.exports = __toCommonJS(getSpecificRecord_exports);
var import_address_encoder = require("@ensdomains/address-encoder");
var import_ethers = require("ethers");
var import_contentHash = require("../utils/contentHash");
var import_normalise = require("../utils/normalise");
const _getContentHash = {
  raw: async ({ contracts }, name) => {
    const publicResolver = await contracts?.getPublicResolver();
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData("contenthash", [
        (0, import_normalise.namehash)(name)
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    let response;
    const publicResolver = await contracts?.getPublicResolver();
    try {
      ;
      [response] = publicResolver.interface.decodeFunctionResult(
        "contenthash",
        data
      );
    } catch {
      return;
    }
    if (!response) {
      return;
    }
    const decodedContent = (0, import_contentHash.decodeContenthash)(response);
    if (!decodedContent || import_ethers.ethers.utils.isBytesLike(decodedContent.decoded) && import_ethers.ethers.utils.hexStripZeros(decodedContent.decoded) === "0x" || Object.keys(decodedContent).length === 0) {
      return;
    }
    return decodedContent;
  }
};
const getContentHash = {
  raw: async ({ contracts, universalWrapper }, name) => {
    const prData = await _getContentHash.raw({ contracts }, name);
    return universalWrapper.raw(name, prData.data);
  },
  decode: async ({ contracts, universalWrapper }, data) => {
    const urData = await universalWrapper.decode(data);
    if (!urData)
      return;
    return _getContentHash.decode({ contracts }, urData.data);
  }
};
const _getText = {
  raw: async ({ contracts }, name, key) => {
    const publicResolver = await contracts?.getPublicResolver();
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData("text", [
        (0, import_normalise.namehash)(name),
        key
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    const publicResolver = await contracts?.getPublicResolver();
    const [response] = publicResolver.interface.decodeFunctionResult(
      "text",
      data
    );
    if (!response) {
      return;
    }
    return response;
  }
};
const getText = {
  raw: async ({ contracts, universalWrapper }, name, key) => {
    const prData = await _getText.raw({ contracts }, name, key);
    return universalWrapper.raw(name, prData.data);
  },
  decode: async ({ contracts, universalWrapper }, data) => {
    const urData = await universalWrapper.decode(data);
    if (!urData)
      return;
    return _getText.decode({ contracts }, urData.data);
  }
};
const _getAddr = {
  raw: async ({ contracts }, name, coinType, bypassFormat) => {
    if (!coinType) {
      coinType = 60;
    }
    const publicResolver = await contracts?.getPublicResolver();
    if (coinType === 60 || coinType === "60") {
      return {
        to: "0x0000000000000000000000000000000000000000",
        data: publicResolver.interface.encodeFunctionData("addr(bytes32)", [
          (0, import_normalise.namehash)(name)
        ])
      };
    }
    if (bypassFormat) {
      return {
        to: "0x0000000000000000000000000000000000000000",
        data: publicResolver.interface.encodeFunctionData(
          "addr(bytes32,uint256)",
          [(0, import_normalise.namehash)(name), coinType]
        )
      };
    }
    const formatter = typeof coinType === "string" && Number.isNaN(parseInt(coinType)) ? import_address_encoder.formatsByName[coinType] : import_address_encoder.formatsByCoinType[typeof coinType === "number" ? coinType : parseInt(coinType)];
    if (!formatter) {
      throw new Error(`No formatter found for coin: ${coinType}`);
    }
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData(
        "addr(bytes32,uint256)",
        [(0, import_normalise.namehash)(name), formatter.coinType]
      )
    };
  },
  decode: async ({ contracts }, data, _name, coinType) => {
    let returnCoinType = true;
    if (!coinType) {
      coinType = 60;
      returnCoinType = false;
    }
    const publicResolver = await contracts?.getPublicResolver();
    const formatter = typeof coinType === "string" && Number.isNaN(parseInt(coinType)) ? import_address_encoder.formatsByName[coinType] : import_address_encoder.formatsByCoinType[typeof coinType === "number" ? coinType : parseInt(coinType)];
    let response;
    if (coinType === 60 || coinType === "60") {
      ;
      [response] = publicResolver.interface.decodeFunctionResult(
        "addr(bytes32)",
        data
      );
    } else {
      ;
      [response] = publicResolver.interface.decodeFunctionResult(
        "addr(bytes32,uint256)",
        data
      );
    }
    if (!response)
      return;
    if (import_ethers.ethers.utils.hexStripZeros(response) === "0x") {
      return;
    }
    const decodedAddr = formatter.encoder(Buffer.from(response.slice(2), "hex"));
    if (!decodedAddr) {
      return;
    }
    if (!returnCoinType) {
      return decodedAddr;
    }
    return { coin: formatter.name, addr: decodedAddr };
  }
};
const getAddr = {
  raw: async ({ contracts, universalWrapper }, name, coinType) => {
    const prData = await _getAddr.raw({ contracts }, name, coinType);
    return universalWrapper.raw(name, prData.data);
  },
  decode: async ({ contracts, universalWrapper }, data, _name, coinType) => {
    const urData = await universalWrapper.decode(data);
    if (!urData)
      return;
    return _getAddr.decode({ contracts }, urData.data, _name, coinType);
  }
};
