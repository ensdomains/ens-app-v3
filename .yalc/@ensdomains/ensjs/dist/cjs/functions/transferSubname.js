"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
async function default_1({ contracts, provider }, name, contract, address, options) {
    const signer = provider?.getSigner(options?.addressOrIndex);
    if (!signer) {
        throw new Error('No signer found');
    }
    const labels = name.split('.');
    const label = labels.shift();
    const labelhash = ethers_1.ethers.utils.solidityKeccak256(['string'], [label]);
    const parentNodehash = ethers_1.ethers.utils.namehash(labels.join('.'));
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.setSubnodeOwner(parentNodehash, labelhash, address);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            return nameWrapper.setSubnodeOwner(parentNodehash, label, address, '0');
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
exports.default = default_1;
