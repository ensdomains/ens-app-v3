"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const public_js_1 = require("../../errors/public.js");
const generateRecordCallArray_js_1 = require("../../utils/generateRecordCallArray.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (_wallet, { name, resolverAddress, ...records }) => {
    const callArray = (0, generateRecordCallArray_js_1.generateRecordCallArray)({
        namehash: (0, normalise_js_1.namehash)(name),
        ...records,
    });
    if (callArray.length === 0)
        throw new public_js_1.NoRecordsSpecifiedError();
    if (callArray.length === 1)
        return {
            to: resolverAddress,
            data: callArray[0],
        };
    return {
        to: resolverAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_js_1.publicResolverMulticallSnippet,
            functionName: 'multicall',
            args: [callArray],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setRecords(wallet, { name, resolverAddress, clearRecords, contentHash, texts, coins, abi, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        resolverAddress,
        clearRecords,
        contentHash,
        texts,
        coins,
        abi,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setRecords.makeFunctionData = exports.makeFunctionData;
exports.default = setRecords;
//# sourceMappingURL=setRecords.js.map