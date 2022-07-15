import { namehash } from '../utils/normalise';
export default async function ({ contracts, provider }, name, contract, resolver, options) {
    const address = await provider
        ?.getSigner(options?.addressOrIndex)
        .getAddress();
    if (!address) {
        throw new Error('No signer found');
    }
    if (!resolver) {
        resolver = (await contracts?.getPublicResolver()).address;
    }
    switch (contract) {
        case 'registry': {
            const registry = (await contracts?.getRegistry()).connect(provider?.getSigner(options?.addressOrIndex));
            return registry.setResolver(namehash(name), resolver);
        }
        case 'nameWrapper': {
            const nameWrapper = (await contracts?.getNameWrapper()).connect(provider?.getSigner(options?.addressOrIndex));
            return nameWrapper.setResolver(namehash(name), resolver);
        }
        default: {
            throw new Error(`Unknown contract: ${contract}`);
        }
    }
}
