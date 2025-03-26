"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeClearRecords_js_1 = require("../../utils/encoders/encodeClearRecords.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (_wallet, { name, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeClearRecords_js_1.encodeClearRecords)((0, normalise_js_1.namehash)(name)),
    };
};
exports.makeFunctionData = makeFunctionData;
async function clearRecords(wallet, { name, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
clearRecords.makeFunctionData = exports.makeFunctionData;
exports.default = clearRecords;
//# sourceMappingURL=clearRecords.js.map