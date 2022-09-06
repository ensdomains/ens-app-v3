"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const normalise_1 = require("../utils/normalise");
const wrapperExpiry_1 = require("../utils/wrapperExpiry");
async function default_1({ contracts, signer, getExpiry, }, name, { contract, owner, resolverAddress, ...wrapperArgs }) {
    const labels = name.split('.');
    const label = labels.shift();
    const labelhash = ethers_1.ethers.utils.solidityKeccak256(['string'], [label]);
    const parentNodehash = (0, normalise_1.namehash)(labels.join('.'));
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.populateTransaction.setSubnodeOwner(parentNodehash, labelhash, owner);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            const expiry = await (0, wrapperExpiry_1.makeExpiry)({ getExpiry }, labels.join('.'), 'expiry' in wrapperArgs ? wrapperArgs.expiry : undefined);
            return nameWrapper.populateTransaction.setSubnodeOwner(parentNodehash, label, owner, '0', expiry);
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
exports.default = default_1;
