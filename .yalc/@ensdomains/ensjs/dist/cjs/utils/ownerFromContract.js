"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerFromContract = void 0;
const viem_1 = require("viem");
const baseRegistrar_js_1 = require("../contracts/baseRegistrar.js");
const getChainContractAddress_js_1 = require("../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../contracts/nameWrapper.js");
const registry_js_1 = require("../contracts/registry.js");
const general_js_1 = require("../errors/general.js");
const ownerFromContract = ({ client, contract, namehash, labels, }) => {
    switch (contract) {
        case 'nameWrapper':
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client, contract: 'ensNameWrapper' }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_js_1.nameWrapperOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt(namehash)],
                }),
            };
        case 'registry':
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client, contract: 'ensRegistry' }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_js_1.registryOwnerSnippet,
                    functionName: 'owner',
                    args: [namehash],
                }),
            };
        case 'registrar':
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client,
                    contract: 'ensBaseRegistrarImplementation',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: baseRegistrar_js_1.baseRegistrarOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt((0, viem_1.labelhash)(labels[0]))],
                }),
            };
        default:
            throw new general_js_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['nameWrapper', 'registry', 'registrar'],
            });
    }
};
exports.ownerFromContract = ownerFromContract;
//# sourceMappingURL=ownerFromContract.js.map