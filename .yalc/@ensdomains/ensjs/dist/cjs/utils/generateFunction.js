"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFunction = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const generateFunction = ({ encode, decode, }) => {
    const single = async function (client, ...args) {
        const { passthrough, ...encodedData } = encode(client, ...args);
        const result = await (0, actions_1.call)(client, encodedData)
            .then((ret) => ret.data)
            .catch((e) => {
            if (!(e instanceof viem_1.BaseError))
                throw e;
            return e;
        });
        if (passthrough)
            return decode(client, result, passthrough, ...args);
        return decode(client, result, ...args);
    };
    single.batch = (...args) => ({
        args,
        encode,
        decode,
    });
    single.encode = encode;
    single.decode = decode;
    return single;
};
exports.generateFunction = generateFunction;
//# sourceMappingURL=generateFunction.js.map