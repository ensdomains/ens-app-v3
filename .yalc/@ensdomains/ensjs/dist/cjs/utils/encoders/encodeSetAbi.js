"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSetAbi = void 0;
const viem_1 = require("viem");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const encodeSetAbi = ({ namehash, contentType, encodedData, }) => {
    return (0, viem_1.encodeFunctionData)({
        abi: publicResolver_js_1.publicResolverSetAbiSnippet,
        functionName: 'setABI',
        args: [namehash, BigInt(contentType), encodedData],
    });
};
exports.encodeSetAbi = encodeSetAbi;
//# sourceMappingURL=encodeSetAbi.js.map