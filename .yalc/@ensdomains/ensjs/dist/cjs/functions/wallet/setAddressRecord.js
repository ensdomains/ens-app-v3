"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeSetAddr_js_1 = require("../../utils/encoders/encodeSetAddr.js");
const normalise_js_1 = require("../../utils/normalise.js");
const makeFunctionData = (_wallet, { name, coin, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetAddr_js_1.encodeSetAddr)({ namehash: (0, normalise_js_1.namehash)(name), coin, value }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setAddressRecord(wallet, { name, coin, value, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        coin,
        value,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setAddressRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setAddressRecord;
//# sourceMappingURL=setAddressRecord.js.map