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
var contentHash_exports = {};
__export(contentHash_exports, {
  decodeContenthash: () => decodeContenthash,
  encodeContenthash: () => encodeContenthash,
  getProtocolType: () => getProtocolType,
  isValidContenthash: () => isValidContenthash,
  validateContent: () => validateContent
});
module.exports = __toCommonJS(contentHash_exports);
var import_content_hash = __toESM(require("@ensdomains/content-hash"));
var import_bytes = require("@ethersproject/bytes");
const supportedCodecs = [
  "ipns-ns",
  "ipfs-ns",
  "swarm-ns",
  "onion",
  "onion3",
  "skynet-ns",
  "arweave-ns"
];
function matchProtocol(text) {
  return text.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave|ar):\/\/(.*)/) || text.match(/\/(ipfs)\/(.*)/) || text.match(/\/(ipns)\/(.*)/);
}
function decodeContenthash(encoded) {
  let decoded;
  let protocolType;
  let error;
  if (!encoded || encoded === "0x") {
    return {};
  }
  if (encoded.error) {
    return { protocolType: null, decoded: encoded.error };
  }
  if (encoded === false) {
    return { protocolType: null, decoded: "invalid value" };
  }
  if (encoded) {
    try {
      decoded = import_content_hash.default.decode(encoded);
      const codec = import_content_hash.default.getCodec(encoded);
      if (codec === "ipfs-ns") {
        protocolType = "ipfs";
      } else if (codec === "ipns-ns") {
        protocolType = "ipns";
      } else if (codec === "swarm-ns") {
        protocolType = "bzz";
      } else if (codec === "onion") {
        protocolType = "onion";
      } else if (codec === "onion3") {
        protocolType = "onion3";
      } else if (codec === "skynet-ns") {
        protocolType = "sia";
      } else if (codec === "arweave-ns") {
        protocolType = "ar";
      } else {
        decoded = encoded;
      }
    } catch (e) {
      error = e.message;
    }
  }
  return { protocolType, decoded, error };
}
function validateContent(encoded) {
  return import_content_hash.default.isHashOfType(encoded, import_content_hash.default.Types.ipfs) || import_content_hash.default.isHashOfType(encoded, import_content_hash.default.Types.swarm);
}
function isValidContenthash(encoded) {
  try {
    const codec = import_content_hash.default.getCodec(encoded);
    return (0, import_bytes.isHexString)(encoded) && supportedCodecs.includes(codec);
  } catch (e) {
    console.log(e);
  }
}
function getProtocolType(encoded) {
  let protocolType;
  let decoded;
  try {
    const matched = matchProtocol(encoded);
    if (matched) {
      ;
      [, protocolType, decoded] = matched;
    }
    return {
      protocolType,
      decoded
    };
  } catch (e) {
    console.log(e);
  }
}
function encodeContenthash(text) {
  let content = text;
  let contentType;
  let encoded = false;
  let error;
  if (text) {
    const matched = matchProtocol(text);
    if (matched) {
      ;
      [, contentType, content] = matched;
    }
    try {
      if (contentType === "ipfs") {
        if (content.length >= 4) {
          encoded = `0x${import_content_hash.default.encode("ipfs-ns", content)}`;
        }
      } else if (contentType === "ipns") {
        encoded = `0x${import_content_hash.default.encode("ipns-ns", content)}`;
      } else if (contentType === "bzz") {
        if (content.length >= 4) {
          encoded = `0x${import_content_hash.default.fromSwarm(content)}`;
        }
      } else if (contentType === "onion") {
        if (content.length === 16) {
          encoded = `0x${import_content_hash.default.encode("onion", content)}`;
        }
      } else if (contentType === "onion3") {
        if (content.length === 56) {
          encoded = `0x${import_content_hash.default.encode("onion3", content)}`;
        }
      } else if (contentType === "sia") {
        if (content.length === 46) {
          encoded = `0x${import_content_hash.default.encode("skynet-ns", content)}`;
        }
      } else if (contentType === "arweave" || contentType === "ar") {
        if (content.length === 43) {
          encoded = `0x${import_content_hash.default.encode("arweave-ns", content)}`;
        }
      } else {
        console.warn("Unsupported protocol or invalid value", {
          contentType,
          text
        });
      }
    } catch (err) {
      const errorMessage = "Error encoding content hash";
      console.warn(errorMessage, { text, encoded });
      error = errorMessage;
    }
  }
  return { encoded, error };
}
