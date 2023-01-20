// src/functions/getSpecificRecord.ts
import { formatsByCoinType, formatsByName } from "@ensdomains/address-encoder";
import { arrayify, hexStripZeros, isBytesLike } from "@ethersproject/bytes";
import { toUtf8String } from "@ethersproject/strings";
import { decodeContenthash } from "../utils/contentHash.mjs";
import { namehash } from "../utils/normalise.mjs";
var _getContentHash = {
  raw: async ({ contracts }, name) => {
    const publicResolver = await contracts?.getPublicResolver();
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData("contenthash", [
        namehash(name)
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
    const decodedContent = decodeContenthash(response);
    if (!decodedContent || isBytesLike(decodedContent.decoded) && hexStripZeros(decodedContent.decoded) === "0x" || Object.keys(decodedContent).length === 0) {
      return;
    }
    return decodedContent;
  }
};
var getContentHash = {
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
var _getText = {
  raw: async ({ contracts }, name, key) => {
    const publicResolver = await contracts?.getPublicResolver();
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData("text", [
        namehash(name),
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
var getText = {
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
var _getAddr = {
  raw: async ({ contracts }, name, coinType, bypassFormat) => {
    if (!coinType) {
      coinType = 60;
    }
    const publicResolver = await contracts?.getPublicResolver();
    if (coinType === 60 || coinType === "60") {
      return {
        to: "0x0000000000000000000000000000000000000000",
        data: publicResolver.interface.encodeFunctionData("addr(bytes32)", [
          namehash(name)
        ])
      };
    }
    if (bypassFormat) {
      return {
        to: "0x0000000000000000000000000000000000000000",
        data: publicResolver.interface.encodeFunctionData(
          "addr(bytes32,uint256)",
          [namehash(name), coinType]
        )
      };
    }
    const formatter = typeof coinType === "string" && Number.isNaN(parseInt(coinType)) ? formatsByName[coinType] : formatsByCoinType[typeof coinType === "number" ? coinType : parseInt(coinType)];
    if (!formatter) {
      throw new Error(`No formatter found for coin: ${coinType}`);
    }
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData(
        "addr(bytes32,uint256)",
        [namehash(name), formatter.coinType]
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
    const formatter = typeof coinType === "string" && Number.isNaN(parseInt(coinType)) ? formatsByName[coinType] : formatsByCoinType[typeof coinType === "number" ? coinType : parseInt(coinType)];
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
    if (hexStripZeros(response) === "0x") {
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
var getAddr = {
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
var supportedContentTypes = "0xf";
var _getABI = {
  raw: async ({ contracts }, name) => {
    const publicResolver = await contracts?.getPublicResolver();
    return {
      to: "0x0000000000000000000000000000000000000000",
      data: publicResolver.interface.encodeFunctionData("ABI", [
        namehash(name),
        supportedContentTypes
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    const publicResolver = await contracts?.getPublicResolver();
    const [bnContentType, encodedABIData] = publicResolver.interface.decodeFunctionResult("ABI", data);
    if (!bnContentType || !data) {
      return;
    }
    const contentType = bnContentType.toNumber();
    if (!contentType) {
      return;
    }
    let abiData;
    let decoded = false;
    switch (contentType) {
      case 1:
        abiData = JSON.parse(toUtf8String(encodedABIData));
        decoded = true;
        break;
      case 2: {
        const { inflate } = await import("pako/dist/pako_inflate.min.js");
        abiData = JSON.parse(
          inflate(arrayify(encodedABIData), { to: "string" })
        );
        decoded = true;
        break;
      }
      case 4: {
        const { decodeFirst } = await import("cbor");
        abiData = await decodeFirst(arrayify(encodedABIData));
        decoded = true;
        break;
      }
      case 8:
        abiData = toUtf8String(encodedABIData);
        decoded = false;
        break;
      default:
        try {
          abiData = toUtf8String(encodedABIData);
        } catch {
          abiData = encodedABIData;
        }
        decoded = false;
    }
    return {
      contentType,
      decoded,
      abi: abiData
    };
  }
};
var getABI = {
  raw: async ({ contracts, universalWrapper }, name) => {
    const prData = await _getABI.raw({ contracts }, name);
    return universalWrapper.raw(name, prData.data);
  },
  decode: async ({ contracts, universalWrapper }, data) => {
    const urData = await universalWrapper.decode(data);
    if (!urData)
      return;
    return _getABI.decode({ contracts }, urData.data);
  }
};
export {
  _getABI,
  _getAddr,
  _getContentHash,
  _getText,
  getABI,
  getAddr,
  getContentHash,
  getText
};
