"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const checkSafeUniversalResolverData_js_1 = require("../../utils/checkSafeUniversalResolverData.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const encode = (client, { address, gatewayUrls }) => {
    const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
    const to = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [(0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(reverseNode))];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverReverseSnippet,
                    functionName: 'reverse',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverReverseSnippet,
                    functionName: 'reverse',
                    args,
                }),
                passthrough: {
                    args,
                    address: to,
                },
            }),
    };
};
const decode = async (_client, data, passthrough, { address, allowMismatch, strict }) => {
    const isSafe = (0, checkSafeUniversalResolverData_js_1.checkSafeUniversalResolverData)(data, {
        strict,
        abi: universalResolver_js_1.universalResolverReverseSnippet,
        args: passthrough.args,
        functionName: 'reverse',
        address: passthrough.address,
    });
    if (!isSafe)
        return null;
    try {
        const result = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_js_1.universalResolverReverseSnippet,
            functionName: 'reverse',
            data,
        });
        if (!result[0])
            return null;
        const match = result[1].toLowerCase() === address.toLowerCase();
        if (!match && !allowMismatch)
            return null;
        return {
            name: result[0],
            match: result[1].toLowerCase() === address.toLowerCase(),
            reverseResolverAddress: result[2],
            resolverAddress: result[3],
        };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const getName = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getName;
//# sourceMappingURL=getName.js.map