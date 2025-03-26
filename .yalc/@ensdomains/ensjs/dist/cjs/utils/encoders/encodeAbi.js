"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeAbi = exports.encodeAsToContentType = exports.contentTypeToEncodeAs = void 0;
const viem_1 = require("viem");
const utils_js_1 = require("../../errors/utils.js");
const abiEncodeMap = {
    json: 1,
    zlib: 2,
    cbor: 4,
    uri: 8,
};
const contentTypeToEncodeAs = (contentType) => {
    switch (contentType) {
        case 1:
            return 'json';
        case 2:
            return 'zlib';
        case 4:
            return 'cbor';
        case 8:
            return 'uri';
        default:
            throw new utils_js_1.UnknownContentTypeError({ contentType });
    }
};
exports.contentTypeToEncodeAs = contentTypeToEncodeAs;
const encodeAsToContentType = (encodeAs) => {
    const contentType = abiEncodeMap[encodeAs];
    if (contentType === undefined) {
        throw new utils_js_1.UnknownContentTypeError({ contentType: encodeAs });
    }
    return contentType;
};
exports.encodeAsToContentType = encodeAsToContentType;
const encodeAbi = async ({ encodeAs, data, }) => {
    let contentType;
    let encodedData = '0x';
    switch (encodeAs) {
        case 'json':
            contentType = 1;
            if (data)
                encodedData = (0, viem_1.stringToHex)(JSON.stringify(data));
            break;
        case 'zlib': {
            contentType = 2;
            if (data) {
                const { deflate } = await Promise.resolve().then(() => require('pako/dist/pako_deflate.min.js'));
                encodedData = (0, viem_1.bytesToHex)(deflate(JSON.stringify(data)));
            }
            break;
        }
        case 'cbor': {
            contentType = 4;
            if (data) {
                const { cborEncode } = await Promise.resolve().then(() => require('@ensdomains/address-encoder/utils'));
                encodedData = (0, viem_1.bytesToHex)(new Uint8Array(cborEncode(data)));
            }
            break;
        }
        default: {
            contentType = 8;
            if (data)
                encodedData = (0, viem_1.stringToHex)(data);
            break;
        }
    }
    return { contentType: contentType, encodedData };
};
exports.encodeAbi = encodeAbi;
//# sourceMappingURL=encodeAbi.js.map