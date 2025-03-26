"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const reverseRegistrar_js_1 = require("../../contracts/reverseRegistrar.js");
const makeFunctionData = (wallet, { name, address, resolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
    client: wallet,
    contract: 'ensPublicResolver',
}), }) => {
    const reverseRegistrarAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client: wallet,
        contract: 'ensReverseRegistrar',
    });
    if (address) {
        return {
            to: reverseRegistrarAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: reverseRegistrar_js_1.reverseRegistrarSetNameForAddrSnippet,
                functionName: 'setNameForAddr',
                args: [
                    address,
                    wallet.account.address,
                    resolverAddress ||
                        (0, getChainContractAddress_js_1.getChainContractAddress)({
                            client: wallet,
                            contract: 'ensPublicResolver',
                        }),
                    name,
                ],
            }),
        };
    }
    return {
        to: reverseRegistrarAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: reverseRegistrar_js_1.reverseRegistrarSetNameSnippet,
            functionName: 'setName',
            args: [name],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setPrimaryName(wallet, { name, address, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)({
        ...wallet,
        account: (0, utils_1.parseAccount)((txArgs.account || wallet.account)),
    }, { name, address, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setPrimaryName.makeFunctionData = exports.makeFunctionData;
exports.default = setPrimaryName;
//# sourceMappingURL=setPrimaryName.js.map