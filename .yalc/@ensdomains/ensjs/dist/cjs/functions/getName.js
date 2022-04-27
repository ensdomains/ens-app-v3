"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
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
        return null;
    const universalResolver = await contracts?.getUniversalResolver();
    try {
        const result = universalResolver.interface.decodeFunctionResult('reverse', data);
        const decoded = ethers_1.ethers.utils.defaultAbiCoder.decode(['bytes', 'address'], result['1']);
        const [addr] = ethers_1.ethers.utils.defaultAbiCoder.decode(['address'], decoded[0]);
        return {
            name: result['0'],
            match: addr.toLowerCase() === address.toLowerCase(),
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
