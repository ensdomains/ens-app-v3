const abiEncodeMap = {
    json: 1n,
    zlib: 2n,
    cbor: 4n,
    uri: 8n,
};
export const generateSupportedContentTypes = (encodeAsItemOrList) => {
    const encodeAsList = Array.isArray(encodeAsItemOrList)
        ? encodeAsItemOrList
        : [encodeAsItemOrList];
    return encodeAsList.reduce((result, encodeAs) => {
        const contentType = abiEncodeMap[encodeAs];
        if (contentType)
            result |= contentType;
        return result;
    }, 0n);
};
//# sourceMappingURL=generateSupportedContentTypes.js.map