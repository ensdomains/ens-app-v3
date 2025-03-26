"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ethRegistrarController_js_1 = require("../../contracts/ethRegistrarController.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const registerHelpers_js_1 = require("../../utils/registerHelpers.js");
const wrapper_js_1 = require("../../utils/wrapper.js");
const makeFunctionData = (wallet, args) => {
    const labels = args.name.split('.');
    const nameType = (0, getNameType_js_1.getNameType)(args.name);
    if (nameType !== 'eth-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Only 2ld-eth name registration is supported',
        });
    (0, wrapper_js_1.wrappedLabelLengthCheck)(labels[0]);
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client: wallet,
            contract: 'ensEthRegistrarController',
        }),
        data: (0, viem_1.encodeFunctionData)({
            abi: ethRegistrarController_js_1.ethRegistrarControllerCommitSnippet,
            functionName: 'commit',
            args: [(0, registerHelpers_js_1.makeCommitment)(args)],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function commitName(wallet, { name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        owner,
        duration,
        secret,
        resolverAddress,
        records,
        reverseRecord,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
commitName.makeFunctionData = exports.makeFunctionData;
exports.default = commitName;
//# sourceMappingURL=commitName.js.map