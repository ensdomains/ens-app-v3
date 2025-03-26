"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeContentHash = exports.getProtocolType = exports.isValidContentHash = exports.decodeContentHash = exports.getInternalCodec = exports.getDisplayCodec = void 0;
const content_hash_1 = require("@ensdomains/content-hash");
const viem_1 = require("viem");
const utils_js_1 = require("../errors/utils.js");
function matchProtocol(text) {
    return (text.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave|ar):\/\/(.*)/) ||
        text.match(/\/(ipfs)\/(.*)/) ||
        text.match(/\/(ipns)\/(.*)/));
}
const getDisplayCodec = (encoded) => {
    const codec = (0, content_hash_1.getCodec)(encoded);
    switch (codec) {
        case 'ipfs':
        case 'ipns':
        case 'onion':
        case 'onion3':
            return codec;
        case 'swarm':
            return 'bzz';
        case 'skynet':
            return 'sia';
        case 'arweave':
            return 'ar';
        default:
            return null;
    }
};
exports.getDisplayCodec = getDisplayCodec;
const getInternalCodec = (displayCodec) => {
    switch (displayCodec) {
        case 'bzz':
            return 'swarm';
        case 'sia':
            return 'skynet';
        case 'ar':
            return 'arweave';
        default:
            return displayCodec;
    }
};
exports.getInternalCodec = getInternalCodec;
function decodeContentHash(encoded) {
    if (!encoded || encoded === '0x') {
        return null;
    }
    const decoded = (0, content_hash_1.decode)(encoded);
    const protocolType = (0, exports.getDisplayCodec)(encoded);
    return { protocolType, decoded };
}
exports.decodeContentHash = decodeContentHash;
function isValidContentHash(encoded) {
    if (typeof encoded !== 'string')
        return false;
    const codec = (0, content_hash_1.getCodec)(encoded);
    return Boolean(codec && (0, viem_1.isHex)(encoded));
}
exports.isValidContentHash = isValidContentHash;
function getProtocolType(encoded) {
    const matched = matchProtocol(encoded);
    if (!matched)
        return null;
    const [, protocolType, decoded] = matched;
    return { protocolType: protocolType, decoded };
}
exports.getProtocolType = getProtocolType;
function encodeContentHash(text) {
    const typeData = getProtocolType(text);
    if (!typeData)
        throw new utils_js_1.InvalidContentHashError();
    const internalCodec = (0, exports.getInternalCodec)(typeData.protocolType);
    if (internalCodec === 'onion' && typeData.decoded.length !== 16)
        throw new utils_js_1.InvalidContentHashError();
    if (internalCodec === 'onion3' && typeData.decoded.length !== 56)
        throw new utils_js_1.InvalidContentHashError();
    return `0x${(0, content_hash_1.encode)(internalCodec, typeData.decoded)}`;
}
exports.encodeContentHash = encodeContentHash;
//# sourceMappingURL=contentHash.js.map