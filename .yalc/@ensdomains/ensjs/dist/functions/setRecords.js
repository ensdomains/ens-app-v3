import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder';
import { ethers } from 'ethers';
import { encodeContenthash } from '../utils/contentHash';
export default async function ({ contracts, provider, getResolver, }, name, records) {
    if (!name.includes('.')) {
        throw new Error('Input is not an ENS name');
    }
    const resolverAddress = await getResolver(name);
    if (!resolverAddress) {
        throw new Error('No resolver found for input address');
    }
    const address = await provider?.getSigner().getAddress();
    if (!address) {
        throw new Error('No signer found');
    }
    const resolver = (await contracts?.getPublicResolver(provider, resolverAddress))?.connect(provider?.getSigner());
    const namehash = ethers.utils.namehash(name);
    const calls = [];
    if (records.contentHash) {
        const contentHash = records.contentHash === '' ? '' : encodeContenthash(records.contentHash);
        const data = resolver?.interface.encodeFunctionData('setContentHash', [
            namehash,
            contentHash,
        ]);
        data && calls.push(data);
    }
    if (records.texts && records.texts.length > 0) {
        records.texts.forEach(({ key, value }) => {
            const data = resolver?.interface.encodeFunctionData('setText', [
                namehash,
                key,
                value,
            ]);
            data && calls.push(data);
        });
    }
    if (records.coinTypes && records.coinTypes.length > 0) {
        records.coinTypes.forEach(({ key, value }) => {
            let coinTypeInstance;
            if (!isNaN(parseInt(key))) {
                coinTypeInstance = formatsByCoinType[parseInt(key)];
            }
            else {
                coinTypeInstance = formatsByName[key.toUpperCase()];
            }
            const coinType = coinTypeInstance.coinType;
            const encodedAddress = coinTypeInstance.decoder(value);
            const data = resolver?.interface.encodeFunctionData('setAddr(bytes32,uint256,bytes)', [namehash, coinType, encodedAddress]);
            data && calls.push(data);
        });
    }
    return resolver?.multicall(calls);
}
