"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const consts_js_1 = require("../../utils/consts.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const encode = (client, { name }) => {
    const address = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [(0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(name))];
    return {
        to: address,
        data: (0, viem_1.encodeFunctionData)({
            abi: universalResolver_js_1.universalResolverFindResolverSnippet,
            functionName: 'findResolver',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw (0, viem_1.getContractError)(data, {
            abi: universalResolver_js_1.universalResolverFindResolverSnippet,
            functionName: 'findResolver',
            args: passthrough.args,
            address: passthrough.address,
        });
    const response = (0, viem_1.decodeFunctionResult)({
        abi: universalResolver_js_1.universalResolverFindResolverSnippet,
        functionName: 'findResolver',
        data,
    });
    if (response[0] === consts_js_1.EMPTY_ADDRESS)
        return null;
    return response[0];
};
const getResolver = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getResolver;
//# sourceMappingURL=getResolver.js.map