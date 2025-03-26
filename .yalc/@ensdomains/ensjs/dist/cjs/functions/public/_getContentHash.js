"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const consts_js_1 = require("../../utils/consts.js");
const contentHash_js_1 = require("../../utils/contentHash.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (_client, { name }) => {
    return {
        to: consts_js_1.EMPTY_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_js_1.publicResolverContenthashSnippet,
            functionName: 'contenthash',
            args: [(0, normalise_js_1.namehash)(name)],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const response = (0, viem_1.decodeFunctionResult)({
            abi: publicResolver_js_1.publicResolverContenthashSnippet,
            functionName: 'contenthash',
            data,
        });
        return (0, contentHash_js_1.decodeContentHash)(response);
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getContentHash = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = _getContentHash;
//# sourceMappingURL=_getContentHash.js.map