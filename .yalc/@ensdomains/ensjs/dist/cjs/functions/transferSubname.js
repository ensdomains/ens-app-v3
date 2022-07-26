"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, { contract, address, }) {
    const labels = name.split('.');
    const label = labels.shift();
    const labelhash = ethers_1.ethers.utils.solidityKeccak256(['string'], [label]);
    const parentNodehash = (0, normalise_1.namehash)(labels.join('.'));
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.populateTransaction.setSubnodeOwner(parentNodehash, labelhash, address);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            return nameWrapper.populateTransaction.setSubnodeOwner(parentNodehash, label, address, '0');
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
exports.default = default_1;
