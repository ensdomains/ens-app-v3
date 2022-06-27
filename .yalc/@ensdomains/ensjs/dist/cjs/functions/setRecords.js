"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const recordHelpers_1 = require("../utils/recordHelpers");
async function default_1({ contracts, provider, getResolver, }, name, records) {
    if (!name.includes('.')) {
        throw new Error('Input is not an ENS name');
    }
    const resolverAddress = await getResolver(name);
    if (!resolverAddress) {
        throw new Error('No resolver found for input address');
    }
    const address = await provider?.getSigner().getAddress();
    if (!address) {
        throw new Error('No signer found');
    }
    const resolver = (await contracts?.getPublicResolver(provider, resolverAddress))?.connect(provider?.getSigner());
    const namehash = ethers_1.ethers.utils.namehash(name);
    const calls = (0, recordHelpers_1.generateRecordCallArray)(namehash, records, resolver);
    return resolver?.multicall(calls);
}
exports.default = default_1;
