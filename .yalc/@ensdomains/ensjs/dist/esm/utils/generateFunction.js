import { BaseError } from 'viem';
import { call } from 'viem/actions';
export const generateFunction = ({ encode, decode, }) => {
    const single = async function (client, ...args) {
        const { passthrough, ...encodedData } = encode(client, ...args);
        const result = await call(client, encodedData)
            .then((ret) => ret.data)
            .catch((e) => {
            if (!(e instanceof BaseError))
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
//# sourceMappingURL=generateFunction.js.map