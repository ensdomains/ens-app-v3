"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const registry_js_1 = require("../../contracts/registry.js");
const general_js_1 = require("../../errors/general.js");
const fuses_js_1 = require("../../utils/fuses.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const makeLabelNodeAndParent_js_1 = require("../../utils/makeLabelNodeAndParent.js");
const wrapper_js_1 = require("../../utils/wrapper.js");
const getWrapperData_js_1 = require("../public/getWrapperData.js");
const base_js_1 = require("../../errors/base.js");
const makeFunctionData = (wallet, { name, contract, owner, resolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
    client: wallet,
    contract: 'ensPublicResolver',
}), expiry, fuses, }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType === 'tld' || nameType === 'root')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: [
                'eth-2ld',
                'eth-subname',
                'other-2ld',
                'other-subname',
            ],
        });
    const { label, labelhash, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
    switch (contract) {
        case 'registry': {
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client: wallet,
                    contract: 'ensRegistry',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_js_1.registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [parentNode, labelhash, owner, resolverAddress, BigInt(0)],
                }),
            };
        }
        case 'nameWrapper': {
            (0, wrapper_js_1.wrappedLabelLengthCheck)(label);
            const generatedFuses = fuses ? (0, fuses_js_1.encodeFuses)({ input: fuses }) : 0;
            const generatedExpiry = expiry
                ? (0, wrapper_js_1.expiryToBigInt)(expiry)
                : (0, wrapper_js_1.makeDefaultExpiry)(generatedFuses);
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client: wallet,
                    contract: 'ensNameWrapper',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_js_1.nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        owner,
                        resolverAddress,
                        BigInt(0),
                        generatedFuses,
                        generatedExpiry,
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
class CreateSubnamePermissionDeniedError extends base_js_1.BaseError {
    constructor({ parentName }) {
        super(`Create subname error: ${parentName} as burned CANNOT_CREATE_SUBDOMAIN fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnamePermissionDeniedError'
        });
        this.parentName = parentName;
    }
}
class CreateSubnameParentNotLockedError extends base_js_1.BaseError {
    constructor({ parentName }) {
        super(`Create subname error: Cannot burn PARENT_CANNOT_CONTROL when ${parentName} has not burned CANNOT_UNWRAP fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnameParentNotLockedError'
        });
        this.parentName = parentName;
    }
}
const checkCanCreateSubname = async (wallet, { name, fuses, contract, }) => {
    if (contract !== 'nameWrapper')
        return;
    const parentName = name.split('.').slice(1).join('.');
    if (parentName === 'eth')
        return;
    const parentWrapperData = await (0, getWrapperData_js_1.default)(wallet, { name: parentName });
    if (parentWrapperData?.fuses?.child?.CANNOT_CREATE_SUBDOMAIN)
        throw new CreateSubnamePermissionDeniedError({ parentName });
    const generatedFuses = fuses ? (0, fuses_js_1.encodeFuses)({ input: fuses }) : 0;
    const isBurningPCC = fuses && BigInt(generatedFuses) & fuses_js_1.ParentFuses.PARENT_CANNOT_CONTROL;
    const isParentCannotUnwrapBurned = parentWrapperData?.fuses?.child?.CANNOT_UNWRAP;
    if (isBurningPCC && !isParentCannotUnwrapBurned)
        throw new CreateSubnameParentNotLockedError({ parentName });
};
async function createSubname(wallet, { name, contract, owner, resolverAddress, expiry, fuses, ...txArgs }) {
    await checkCanCreateSubname(wallet, { name, fuses, contract });
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        contract,
        owner,
        resolverAddress,
        expiry,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
createSubname.makeFunctionData = exports.makeFunctionData;
exports.default = createSubname;
//# sourceMappingURL=createSubname.js.map