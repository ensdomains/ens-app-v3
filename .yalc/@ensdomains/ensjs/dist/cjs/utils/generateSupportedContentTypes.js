"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSupportedContentTypes = void 0;
const abiEncodeAsMap = {
    json: 1n,
    zlib: 2n,
    cbor: 4n,
    uri: 8n,
};
const generateSupportedContentTypes = (encodeAsItemOrList) => {
    const encodeAsList = Array.isArray(encodeAsItemOrList)
        ? encodeAsItemOrList
        : [encodeAsItemOrList];
    return encodeAsList.reduce((result, encodeAs) => {
        const contentType = abiEncodeAsMap[encodeAs];
        if (contentType)
            result |= contentType;
        return result;
    }, 0n);
};
exports.generateSupportedContentTypes = generateSupportedContentTypes;
//# sourceMappingURL=generateSupportedContentTypes.js.map