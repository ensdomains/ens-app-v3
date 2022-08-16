import { ethers } from 'ethers';
import { namehash } from '../utils/normalise';
import { makeExpiry } from '../utils/wrapperExpiry';
export default async function ({ contracts, signer, getExpiry, }, name, { contract, owner, resolverAddress, ...wrapperArgs }) {
    const labels = name.split('.');
    const label = labels.shift();
    const labelhash = ethers.utils.solidityKeccak256(['string'], [label]);
    const parentNodehash = namehash(labels.join('.'));
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.populateTransaction.setSubnodeOwner(parentNodehash, labelhash, owner);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            const expiry = await makeExpiry({ getExpiry }, labels.join('.'), 'expiry' in wrapperArgs ? wrapperArgs.expiry : undefined);
            return nameWrapper.populateTransaction.setSubnodeOwner(parentNodehash, label, owner, '0', expiry);
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
