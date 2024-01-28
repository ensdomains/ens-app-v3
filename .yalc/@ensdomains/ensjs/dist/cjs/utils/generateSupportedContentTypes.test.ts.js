"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateSupportedContentTypes_js_1 = require("./generateSupportedContentTypes.js");
describe('generateSupportedContentTypes', () => {
    it.each([
        ['json', 1n],
        ['zlib', 2n],
        ['cbor', 4n],
        ['uri', 8n],
        ['unknown', 0n],
        [['json', 'zlib'], 3n],
        [['zlib', 'cbor'], 6n],
        [['cbor', 'uri'], 12n],
        [['json', 'zlib', 'cbor', 'uri'], 15n],
    ])('should return the correct bitwise value supportedContentTypes %p (%p)', (encodedAs, expected) => {
        const result = (0, generateSupportedContentTypes_js_1.generateSupportedContentTypes)(encodedAs);
        expect(result).toEqual(expected);
    });
});
//# sourceMappingURL=generateSupportedContentTypes.test.ts.js.map