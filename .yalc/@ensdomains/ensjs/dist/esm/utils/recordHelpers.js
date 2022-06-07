import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder';
import { encodeContenthash } from './contentHash';
export const generateSetAddr = (namehash, coinType, address, resolver) => {
    let coinTypeInstance;
    if (!isNaN(parseInt(coinType))) {
        coinTypeInstance = formatsByCoinType[parseInt(coinType)];
    }
    else {
        coinTypeInstance = formatsByName[coinType.toUpperCase()];
    }
    const inputCoinType = coinTypeInstance.coinType;
    const encodedAddress = coinTypeInstance.decoder(address);
    return resolver?.interface.encodeFunctionData('setAddr(bytes32,uint256,bytes)', [namehash, inputCoinType, encodedAddress]);
};
export const generateRecordCallArray = (namehash, records, resolver) => {
    const calls = [];
    if (records.contentHash) {
        const contentHash = records.contentHash === '' ? '' : encodeContenthash(records.contentHash);
        const data = resolver?.interface.encodeFunctionData('setContenthash', [namehash, contentHash]);
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
            const data = generateSetAddr(namehash, key, value, resolver);
            data && calls.push(data);
        });
    }
    return calls;
};
