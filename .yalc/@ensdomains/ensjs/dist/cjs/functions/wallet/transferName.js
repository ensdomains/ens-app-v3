"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const baseRegistrar_js_1 = require("../../contracts/baseRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const registry_js_1 = require("../../contracts/registry.js");
const general_js_1 = require("../../errors/general.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const makeLabelNodeAndParent_js_1 = require("../../utils/makeLabelNodeAndParent.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (wallet, { name, newOwnerAddress, contract, reclaim, asParent, }) => {
    if (reclaim && contract !== 'registrar')
        throw new general_js_1.AdditionalParameterSpecifiedError({
            parameter: 'reclaim',
            allowedParameters: ['name', 'newOwnerAddress', 'contract'],
            details: "Can't reclaim a name from any contract other than the registrar",
        });
    switch (contract) {
        case 'registry': {
            const registryAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensRegistry',
            });
            if (asParent) {
                const { labelhash: labelhashId, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
                return {
                    to: registryAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: registry_js_1.registrySetSubnodeOwnerSnippet,
                        functionName: 'setSubnodeOwner',
                        args: [parentNode, labelhashId, newOwnerAddress],
                    }),
                };
            }
            return {
                to: registryAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_js_1.registrySetOwnerSnippet,
                    functionName: 'setOwner',
                    args: [(0, normalise_js_1.namehash)(name), newOwnerAddress],
                }),
            };
        }
        case 'registrar': {
            if (asParent)
                throw new general_js_1.AdditionalParameterSpecifiedError({
                    parameter: 'asParent',
                    allowedParameters: ['name', 'newOwnerAddress', 'contract', 'reclaim'],
                    details: "Can't transfer a name as the parent owner on the registrar",
                });
            const nameType = (0, getNameType_js_1.getNameType)(name);
            if (nameType !== 'eth-2ld')
                throw new general_js_1.UnsupportedNameTypeError({
                    nameType,
                    supportedNameTypes: ['eth-2ld'],
                    details: 'Only eth-2ld names can be transferred on the registrar contract',
                });
            const labels = name.split('.');
            const tokenId = BigInt((0, viem_1.labelhash)(labels[0]));
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client: wallet,
                    contract: 'ensBaseRegistrarImplementation',
                }),
                data: reclaim
                    ? (0, viem_1.encodeFunctionData)({
                        abi: baseRegistrar_js_1.baseRegistrarReclaimSnippet,
                        functionName: 'reclaim',
                        args: [tokenId, newOwnerAddress],
                    })
                    : (0, viem_1.encodeFunctionData)({
                        abi: baseRegistrar_js_1.baseRegistrarSafeTransferFromSnippet,
                        functionName: 'safeTransferFrom',
                        args: [wallet.account.address, newOwnerAddress, tokenId],
                    }),
            };
        }
        case 'nameWrapper': {
            const nameWrapperAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensNameWrapper',
            });
            if (asParent) {
                const { label, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
                return {
                    to: nameWrapperAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: nameWrapper_js_1.nameWrapperSetSubnodeOwnerSnippet,
                        functionName: 'setSubnodeOwner',
                        args: [parentNode, label, newOwnerAddress, 0, BigInt(0)],
                    }),
                };
            }
            return {
                to: nameWrapperAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_js_1.nameWrapperSafeTransferFromSnippet,
                    functionName: 'safeTransferFrom',
                    args: [
                        wallet.account.address,
                        newOwnerAddress,
                        BigInt((0, normalise_js_1.namehash)(name)),
                        BigInt(1),
                        '0x',
                    ],
                }),
            };
        }
        default:
            throw new general_js_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'registrar', 'nameWrapper'],
            });
    }
};
exports.makeFunctionData = makeFunctionData;
async function transferName(wallet, { name, newOwnerAddress, contract, reclaim, asParent, ...txArgs }) {
    const data = (0, exports.makeFunctionData)({
        ...wallet,
        account: (0, utils_1.parseAccount)((txArgs.account || wallet.account)),
    }, {
        name,
        newOwnerAddress,
        contract,
        reclaim,
        asParent,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
transferName.makeFunctionData = exports.makeFunctionData;
exports.default = transferName;
//# sourceMappingURL=transferName.js.map