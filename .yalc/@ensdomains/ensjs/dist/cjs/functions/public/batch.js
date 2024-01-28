"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_js_1 = require("../../errors/public.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const multicallWrapper_js_1 = require("./multicallWrapper.js");
const encode = (client, ...items) => {
    const rawDataArr = items.map(({ args, encode: encodeRef }, i) => {
        if (!encodeRef)
            throw new public_js_1.FunctionNotBatchableError({ functionIndex: i });
        return encodeRef(client, ...args);
    });
    const response = multicallWrapper_js_1.default.encode(client, {
        transactions: rawDataArr,
    });
    return { ...response, passthrough: rawDataArr };
};
const decode = async (client, data, passthrough, ...items) => {
    const response = await multicallWrapper_js_1.default.decode(client, data, passthrough);
    if (!response)
        throw new Error('No response from multicall');
    return Promise.all(response.map((ret, i) => {
        if (passthrough[i].passthrough) {
            return items[i].decode(client, ret.returnData, passthrough[i].passthrough, ...items[i].args);
        }
        return items[i].decode(client, ret.returnData, ...items[i].args);
    }));
};
const batch = (0, generateFunction_js_1.generateFunction)({
    encode,
    decode,
});
exports.default = batch;
//# sourceMappingURL=batch.js.map