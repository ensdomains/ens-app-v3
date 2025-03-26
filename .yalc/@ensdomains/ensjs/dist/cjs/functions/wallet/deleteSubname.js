"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const registry_js_1 = require("../../contracts/registry.js");
const general_js_1 = require("../../errors/general.js");
const consts_js_1 = require("../../utils/consts.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const makeLabelNodeAndParent_js_1 = require("../../utils/makeLabelNodeAndParent.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (wallet, { name, contract, asOwner }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'eth-subname' && nameType !== 'other-subname')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-subname', 'other-subname'],
            details: 'Cannot delete a name that is not a subname',
        });
    switch (contract) {
        case 'registry': {
            const registryAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensRegistry',
            });
            if (asOwner)
                return {
                    to: registryAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: registry_js_1.registrySetRecordSnippet,
                        functionName: 'setRecord',
                        args: [(0, normalise_js_1.namehash)(name), consts_js_1.EMPTY_ADDRESS, consts_js_1.EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { labelhash, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
            return {
                to: registryAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_js_1.registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        labelhash,
                        consts_js_1.EMPTY_ADDRESS,
                        consts_js_1.EMPTY_ADDRESS,
                        BigInt(0),
                    ],
                }),
            };
        }
        case 'nameWrapper': {
            const nameWrapperAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensNameWrapper',
            });
            if (asOwner)
                return {
                    to: nameWrapperAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: nameWrapper_js_1.nameWrapperSetRecordSnippet,
                        functionName: 'setRecord',
                        args: [(0, normalise_js_1.namehash)(name), consts_js_1.EMPTY_ADDRESS, consts_js_1.EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { label, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
            return {
                to: nameWrapperAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_js_1.nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        consts_js_1.EMPTY_ADDRESS,
                        consts_js_1.EMPTY_ADDRESS,
                        BigInt(0),
                        0,
                        BigInt(0),
                    ],
                }),
            };
        }
        default:
            throw new general_js_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'nameWrapper'],
            });
    }
};
exports.makeFunctionData = makeFunctionData;
async function deleteSubname(wallet, { name, contract, asOwner, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        contract,
        asOwner,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
deleteSubname.makeFunctionData = exports.makeFunctionData;
exports.default = deleteSubname;
//# sourceMappingURL=deleteSubname.js.map