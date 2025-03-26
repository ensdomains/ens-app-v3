"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ensdomains/address-encoder/utils");
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const checkSafeUniversalResolverData_js_1 = require("../../utils/checkSafeUniversalResolverData.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const getRevertErrorData_js_1 = require("../../utils/getRevertErrorData.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (client, { address, coinType, chainId, gatewayUrls, }) => {
    const to = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [
        address,
        chainId
            ? (0, utils_1.evmChainIdToCoinType)(chainId)
            : coinType || 60n,
    ];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverReverseWithGatewaysSnippet,
                    functionName: 'reverseWithGateways',
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
const decode = async (_client, data, passthrough, { allowMismatch, strict, gatewayUrls }) => {
    const isSafe = (0, checkSafeUniversalResolverData_js_1.checkSafeUniversalResolverData)(data, {
        strict,
        abi: gatewayUrls
            ? universalResolver_js_1.universalResolverReverseWithGatewaysSnippet
            : universalResolver_js_1.universalResolverReverseSnippet,
        args: passthrough.args,
        functionName: 'reverse',
        address: passthrough.address,
    });
    if (!isSafe) {
        if (!allowMismatch)
            return null;
        const errorData = (0, getRevertErrorData_js_1.getRevertErrorData)(data);
        if (!errorData)
            return null;
        try {
            const decodedError = (0, viem_1.decodeErrorResult)({
                abi: universalResolver_js_1.universalResolverReverseSnippet,
                data: errorData,
            });
            if (decodedError.errorName !== 'ReverseAddressMismatch')
                return null;
            return {
                name: decodedError.args[0],
                match: false,
                reverseResolverAddress: viem_1.zeroAddress,
                resolverAddress: viem_1.zeroAddress,
            };
        }
        catch {
            return null;
        }
    }
    try {
        const [unnormalisedName, resolverAddress, reverseResolverAddress] = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_js_1.universalResolverReverseSnippet,
            functionName: 'reverse',
            data,
        });
        if (!unnormalisedName)
            return null;
        const normalisedName = (0, normalise_js_1.normalise)(unnormalisedName);
        return {
            name: normalisedName,
            match: true,
            reverseResolverAddress,
            resolverAddress,
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