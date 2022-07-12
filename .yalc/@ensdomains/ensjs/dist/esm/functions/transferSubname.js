import { ethers } from 'ethers';
import { namehash } from '../utils/normalise';
export default async function ({ contracts, signer }, name, { contract, address, }) {
    const labels = name.split('.');
    const label = labels.shift();
    const labelhash = ethers.utils.solidityKeccak256(['string'], [label]);
    const parentNodehash = namehash(labels.join('.'));
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
