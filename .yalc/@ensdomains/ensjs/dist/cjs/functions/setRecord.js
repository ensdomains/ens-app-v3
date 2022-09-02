"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
const recordHelpers_1 = require("../utils/recordHelpers");
async function default_1({ contracts, provider, getResolver, signer, }, name, { record, type, resolverAddress, }) {
    if (!name.includes('.')) {
        throw new Error('Input is not an ENS name');
    }
    let resolverToUse;
    if (resolverAddress) {
        resolverToUse = resolverAddress;
    }
    else {
        resolverToUse = await getResolver(name);
    }
    if (!resolverToUse) {
        throw new Error('No resolver found for input address');
    }
    const resolver = (await contracts?.getPublicResolver(provider, resolverToUse))?.connect(signer);
    const hash = (0, normalise_1.namehash)(name);
    const call = (0, recordHelpers_1.generateSingleRecordCall)(hash, resolver, type)(record);
    return {
        to: resolver.address,
        data: call,
    };
}
exports.default = default_1;
