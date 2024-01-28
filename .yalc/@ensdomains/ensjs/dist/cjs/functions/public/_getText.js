"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const consts_js_1 = require("../../utils/consts.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (_client, { name, key }) => {
    return {
        to: consts_js_1.EMPTY_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_js_1.publicResolverTextSnippet,
            functionName: 'text',
            args: [(0, normalise_js_1.namehash)(name), key],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const response = (0, viem_1.decodeFunctionResult)({
            abi: publicResolver_js_1.publicResolverTextSnippet,
            functionName: 'text',
            data,
        });
        if (!response)
            return null;
        return response;
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getText = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = _getText;
//# sourceMappingURL=_getText.js.map