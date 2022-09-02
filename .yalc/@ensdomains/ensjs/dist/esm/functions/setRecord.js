import { namehash } from '../utils/normalise';
import { generateSingleRecordCall, } from '../utils/recordHelpers';
export default async function ({ contracts, provider, getResolver, signer, }, name, { record, type, resolverAddress, }) {
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
    const hash = namehash(name);
    const call = generateSingleRecordCall(hash, resolver, type)(record);
    return {
        to: resolver.address,
        data: call,
    };
}
