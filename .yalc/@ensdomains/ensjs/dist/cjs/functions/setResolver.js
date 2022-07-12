"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, { contract, resolver, }) {
    if (!resolver) {
        resolver = (await contracts?.getPublicResolver()).address;
    }
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.setResolver((0, normalise_1.namehash)(name), resolver);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            return nameWrapper.setResolver((0, normalise_1.namehash)(name), resolver);
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
exports.default = default_1;
