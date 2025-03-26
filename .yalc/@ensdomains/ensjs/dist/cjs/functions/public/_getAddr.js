"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const normalise_js_1 = require("../../utils/normalise.js");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const consts_js_1 = require("../../utils/consts.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const normaliseCoinId_js_1 = require("../../utils/normaliseCoinId.js");
const encode = (_client, { name, coin = 60, bypassFormat }) => {
    const coder = (0, normaliseCoinId_js_1.getCoderFromCoin)(coin);
    if (coder.coinType === 60) {
        return {
            to: consts_js_1.EMPTY_ADDRESS,
            data: (0, viem_1.encodeFunctionData)({
                abi: publicResolver_js_1.publicResolverSingleAddrSnippet,
                functionName: 'addr',
                args: [(0, normalise_js_1.namehash)(name)],
            }),
        };
    }
    if (bypassFormat) {
        return {
            to: consts_js_1.EMPTY_ADDRESS,
            data: (0, viem_1.encodeFunctionData)({
                abi: publicResolver_js_1.publicResolverMultiAddrSnippet,
                functionName: 'addr',
                args: [(0, normalise_js_1.namehash)(name), BigInt(coin)],
            }),
        };
    }
    return {
        to: consts_js_1.EMPTY_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_js_1.publicResolverMultiAddrSnippet,
            functionName: 'addr',
            args: [(0, normalise_js_1.namehash)(name), BigInt(coder.coinType)],
        }),
    };
};
const decode = async (_client, data, { coin = 60, strict }) => {
    if (data === '0x')
        return null;
    const coder = (0, normaliseCoinId_js_1.getCoderFromCoin)(coin);
    let response;
    try {
        if (coder.coinType === 60) {
            response = (0, viem_1.decodeFunctionResult)({
                abi: publicResolver_js_1.publicResolverSingleAddrSnippet,
                functionName: 'addr',
                data,
            });
        }
        else {
            response = (0, viem_1.decodeFunctionResult)({
                abi: publicResolver_js_1.publicResolverMultiAddrSnippet,
                functionName: 'addr',
                data,
            });
        }
        if (!response)
            return null;
        const trimmed = (0, viem_1.trim)(response);
        if (trimmed === '0x' || trimmed === '0x0' || trimmed === '0x00') {
            return null;
        }
        const decodedAddr = coder.encode((0, viem_1.hexToBytes)(response));
        if (!decodedAddr) {
            return null;
        }
        return { id: coder.coinType, name: coder.name, value: decodedAddr };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getAddr = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = _getAddr;
//# sourceMappingURL=_getAddr.js.map