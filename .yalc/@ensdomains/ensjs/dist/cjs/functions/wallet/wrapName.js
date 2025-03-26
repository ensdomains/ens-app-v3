"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const baseRegistrar_js_1 = require("../../contracts/baseRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const general_js_1 = require("../../errors/general.js");
const fuses_js_1 = require("../../utils/fuses.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const validation_js_1 = require("../../utils/validation.js");
const wrapper_js_1 = require("../../utils/wrapper.js");
const makeFunctionData = (wallet, { name, newOwnerAddress, fuses, resolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
    client: wallet,
    contract: 'ensPublicResolver',
}), }) => {
    const labels = name.split('.');
    const isEth2ld = (0, validation_js_1.checkIsDotEth)(labels);
    const nameWrapperAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client: wallet,
        contract: 'ensNameWrapper',
    });
    if (isEth2ld) {
        (0, wrapper_js_1.wrappedLabelLengthCheck)(labels[0]);
        const encodedFuses = fuses
            ? (0, fuses_js_1.encodeFuses)({ restriction: 'child', input: fuses })
            : 0;
        const tokenId = BigInt((0, viem_1.labelhash)(labels[0]));
        const data = (0, viem_1.encodeAbiParameters)([
            { name: 'label', type: 'string' },
            { name: 'wrappedOwner', type: 'address' },
            { name: 'ownerControlledFuses', type: 'uint16' },
            { name: 'resolverAddress', type: 'address' },
        ], [labels[0], newOwnerAddress, encodedFuses, resolverAddress]);
        return {
            to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensBaseRegistrarImplementation',
            }),
            data: (0, viem_1.encodeFunctionData)({
                abi: baseRegistrar_js_1.baseRegistrarSafeTransferFromWithDataSnippet,
                functionName: 'safeTransferFrom',
                args: [wallet.account.address, nameWrapperAddress, tokenId, data],
            }),
        };
    }
    if (fuses)
        throw new general_js_1.AdditionalParameterSpecifiedError({
            parameter: 'fuses',
            allowedParameters: ['name', 'wrappedOwner', 'resolverAddress'],
            details: 'Fuses cannot be initially set when wrapping non eth-2ld names',
        });
    labels.forEach((label) => (0, wrapper_js_1.wrappedLabelLengthCheck)(label));
    return {
        to: nameWrapperAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_js_1.nameWrapperWrapSnippet,
            functionName: 'wrap',
            args: [(0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(name)), newOwnerAddress, resolverAddress],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function wrapName(wallet, { name, newOwnerAddress, fuses, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)({
        ...wallet,
        account: (0, utils_1.parseAccount)((txArgs.account || wallet.account)),
    }, { name, newOwnerAddress, fuses, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
wrapName.makeFunctionData = exports.makeFunctionData;
exports.default = wrapName;
//# sourceMappingURL=wrapName.js.map