"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const fuses_js_1 = require("../../utils/fuses.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (wallet, { name, fuses }) => {
    const encodedFuses = (0, fuses_js_1.encodeFuses)({ restriction: 'child', input: fuses });
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client: wallet, contract: 'ensNameWrapper' }),
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_js_1.nameWrapperSetFusesSnippet,
            functionName: 'setFuses',
            args: [(0, normalise_js_1.namehash)(name), encodedFuses],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setFuses(wallet, { name, fuses, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, { name, fuses });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setFuses.makeFunctionData = exports.makeFunctionData;
exports.default = setFuses;
//# sourceMappingURL=setFuses.js.map