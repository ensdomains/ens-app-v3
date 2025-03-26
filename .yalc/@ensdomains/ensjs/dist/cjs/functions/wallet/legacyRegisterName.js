"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const legacyRegisterHelpers_js_1 = require("../../utils/legacyRegisterHelpers.js");
const legacyEthRegistrarController_js_1 = require("../../contracts/legacyEthRegistrarController.js");
const makeFunctionData = (wallet, { value, ...args }) => {
    const nameType = (0, getNameType_js_1.getNameType)(args.name);
    if (nameType !== 'eth-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Only 2ld-eth name registration is supported',
        });
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client: wallet,
            contract: 'legacyEthRegistrarController',
        }),
        data: (0, legacyRegisterHelpers_js_1.isLegacyRegistrationWithConfigParameters)(args)
            ? (0, viem_1.encodeFunctionData)({
                abi: legacyEthRegistrarController_js_1.legacyEthRegistrarControllerRegisterWithConfigSnippet,
                functionName: 'registerWithConfig',
                args: (0, legacyRegisterHelpers_js_1.makeLegacyRegistrationWithConfigTuple)(args),
            })
            : (0, viem_1.encodeFunctionData)({
                abi: legacyEthRegistrarController_js_1.legacyEthRegistrarControllerRegisterSnippet,
                functionName: 'register',
                args: (0, legacyRegisterHelpers_js_1.makeLegacyRegistrationTuple)(args),
            }),
        value,
    };
};
exports.makeFunctionData = makeFunctionData;
async function legacyRegisterName(wallet, { name, owner, duration, secret, resolverAddress, address, value, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        owner,
        duration,
        secret,
        resolverAddress,
        address,
        value,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
legacyRegisterName.makeFunctionData = exports.makeFunctionData;
exports.default = legacyRegisterName;
//# sourceMappingURL=legacyRegisterName.js.map