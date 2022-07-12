import { namehash } from '../utils/normalise';
export default async function ({ contracts, signer }, name, { contract, resolver, }) {
    if (!resolver) {
        resolver = (await contracts?.getPublicResolver()).address;
    }
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(signer);
            return registry.setResolver(namehash(name), resolver);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
            return nameWrapper.setResolver(namehash(name), resolver);
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
