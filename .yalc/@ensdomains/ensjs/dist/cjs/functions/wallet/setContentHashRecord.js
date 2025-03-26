"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeSetContentHash_js_1 = require("../../utils/encoders/encodeSetContentHash.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (_wallet, { name, contentHash, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetContentHash_js_1.encodeSetContentHash)({ namehash: (0, normalise_js_1.namehash)(name), contentHash }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setContentHashRecord(wallet, { name, contentHash, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        contentHash,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setContentHashRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setContentHashRecord;
//# sourceMappingURL=setContentHashRecord.js.map