import { bytesToHex, stringToHex } from 'viem';
import { UnknownContentTypeError } from '../../errors/utils.js';
const abiEncodeMap = {
    json: 1,
    zlib: 2,
    cbor: 4,
    uri: 8,
};
export const contentTypeToEncodeAs = (contentType) => {
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
            throw new UnknownContentTypeError({ contentType });
    }
};
export const encodeAsToContentType = (encodeAs) => {
    const contentType = abiEncodeMap[encodeAs];
    if (contentType === undefined) {
        throw new UnknownContentTypeError({ contentType: encodeAs });
    }
    return contentType;
};
export const encodeAbi = async ({ encodeAs, data, }) => {
    let contentType;
    let encodedData = '0x';
    switch (encodeAs) {
        case 'json':
            contentType = 1;
            if (data)
                encodedData = stringToHex(JSON.stringify(data));
            break;
        case 'zlib': {
            contentType = 2;
            if (data) {
                const { deflate } = await import('pako/dist/pako_deflate.min.js');
                encodedData = bytesToHex(deflate(JSON.stringify(data)));
            }
            break;
        }
        case 'cbor': {
            contentType = 4;
            if (data) {
                const { cborEncode } = await import('@ensdomains/address-encoder/utils');
                encodedData = bytesToHex(new Uint8Array(cborEncode(data)));
            }
            break;
        }
        default: {
            contentType = 8;
            if (data)
                encodedData = stringToHex(data);
            break;
        }
    }
    return { contentType: contentType, encodedData };
};
//# sourceMappingURL=encodeAbi.js.map