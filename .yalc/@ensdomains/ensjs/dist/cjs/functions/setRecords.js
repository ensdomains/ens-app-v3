"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
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
    const hash = (0, normalise_1.namehash)(name);
    const calls = (0, recordHelpers_1.generateRecordCallArray)(hash, records, resolver);
    return resolver?.multicall(calls);
}
exports.default = default_1;
