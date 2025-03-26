"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (client, { name }) => {
    const address = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [(0, normalise_js_1.namehash)(name)];
    return {
        to: address,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_js_1.nameWrapperNamesSnippet,
            functionName: 'names',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw (0, viem_1.getContractError)(data, {
            abi: nameWrapper_js_1.nameWrapperNamesSnippet,
            functionName: 'names',
            args: passthrough.args,
            address: passthrough.address,
        });
    const result = (0, viem_1.decodeFunctionResult)({
        abi: nameWrapper_js_1.nameWrapperNamesSnippet,
        functionName: 'names',
        data,
    });
    if (!result || result === '0x' || BigInt(result) === 0n)
        return null;
    return (0, hexEncodedName_js_1.bytesToPacket)((0, viem_1.hexToBytes)(result));
};
const getWrapperName = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getWrapperName;
//# sourceMappingURL=getWrapperName.js.map