"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const baseRegistrar_js_1 = require("../../contracts/baseRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const encode = (client, { name }) => {
    const labels = name.split('.');
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'eth-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Currently only eth-2ld names can be checked for availability',
        });
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client,
            contract: 'ensBaseRegistrarImplementation',
        }),
        data: (0, viem_1.encodeFunctionData)({
            abi: baseRegistrar_js_1.baseRegistrarAvailableSnippet,
            functionName: 'available',
            args: [BigInt((0, viem_1.labelhash)(labels[0]))],
        }),
    };
};
const decode = async (_client, data) => {
    if (typeof data === 'object')
        throw data;
    const result = (0, viem_1.decodeFunctionResult)({
        abi: baseRegistrar_js_1.baseRegistrarAvailableSnippet,
        functionName: 'available',
        data,
    });
    return result;
};
const getAvailable = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getAvailable;
//# sourceMappingURL=getAvailable.js.map