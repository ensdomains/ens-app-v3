"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hexEncodedName_1 = require("../utils/hexEncodedName");
const raw = async ({ contracts }, address) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const reverseNode = address.toLowerCase().substring(2) + '.addr.reverse';
    return {
        to: universalResolver.address,
        data: universalResolver.interface.encodeFunctionData('reverse', [
            (0, hexEncodedName_1.hexEncodeName)(reverseNode),
        ]),
    };
};
const decode = async ({ contracts }, data, address) => {
    if (data === null)
        return;
    const universalResolver = await contracts?.getUniversalResolver();
    try {
        const result = universalResolver.interface.decodeFunctionResult('reverse', data);
        return {
            name: result['0'],
            match: result['1'].toLowerCase() === address.toLowerCase(),
            reverseResolverAddress: result['2'],
            resolverAddress: result['3'],
        };
    }
    catch {
        return { name: null, match: false };
    }
};
exports.default = {
    raw,
    decode,
};
