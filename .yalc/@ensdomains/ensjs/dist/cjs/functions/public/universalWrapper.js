"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const checkSafeUniversalResolverData_js_1 = require("../../utils/checkSafeUniversalResolverData.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const labels_js_1 = require("../../utils/labels.js");
const encode = (client, { name, data, gatewayUrls }) => {
    const nameWithSizedLabels = name
        .split('.')
        .map((label) => {
        const labelLength = (0, viem_1.toBytes)(label).byteLength;
        if (labelLength > 255) {
            return (0, labels_js_1.encodeLabelhash)((0, viem_1.labelhash)(label));
        }
        return label;
    })
        .join('.');
    const to = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [(0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(nameWithSizedLabels)), data];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverResolveWithGatewaysSnippet,
                    functionName: 'resolveWithGateways',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args,
                }),
                passthrough: {
                    args,
                    address: to,
                },
            }),
    };
};
const decode = async (_client, data, passthrough, { strict, gatewayUrls, }) => {
    const isSafe = (0, checkSafeUniversalResolverData_js_1.checkSafeUniversalResolverData)(data, {
        strict,
        abi: gatewayUrls
            ? universalResolver_js_1.universalResolverResolveWithGatewaysSnippet
            : universalResolver_js_1.universalResolverResolveSnippet,
        args: passthrough.args,
        functionName: 'resolve',
        address: passthrough.address,
    });
    if (!isSafe)
        return null;
    try {
        const result = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_js_1.universalResolverResolveSnippet,
            functionName: 'resolve',
            data,
        });
        return { data: result[0], resolver: result[1] };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const universalWrapper = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = universalWrapper;
//# sourceMappingURL=universalWrapper.js.map