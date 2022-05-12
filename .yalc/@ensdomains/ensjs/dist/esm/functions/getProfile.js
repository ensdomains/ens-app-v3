import { formatsByName } from '@ensdomains/address-encoder';
import { ethers } from 'ethers';
import { decodeContenthash } from '../utils/contentHash';
import { hexEncodeName } from '../utils/hexEncodedName';
import { parseInputType } from '../utils/validation';
const makeMulticallData = async ({ _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, name, options) => {
    let calls = [];
    options.texts &&
        (calls = [
            ...calls,
            ...(await Promise.all(options.texts.map(async (x) => ({
                key: x,
                data: await _getText.raw(name, x),
                type: 'text',
            })))),
        ]);
    options.coinTypes &&
        (calls = [
            ...calls,
            ...(await Promise.all(options.coinTypes.map(async (x) => ({
                key: x,
                data: await _getAddr.raw(name, x, true),
                type: 'addr',
            })))),
        ]);
    if (typeof options.contentHash === 'boolean' && options.contentHash) {
        calls.push({
            key: 'contentHash',
            data: await _getContentHash.raw(name),
            type: 'contenthash',
        });
    }
    if (!calls.find((x) => x.key === '60')) {
        calls.push({
            key: '60',
            data: await _getAddr.raw(name, '60', true),
            type: 'addr',
        });
    }
    const prRawData = await resolverMulticallWrapper.raw(calls.map((x) => x.data));
    return { data: prRawData.data, calls };
};
const makeHashIndexes = (data, name) => [...data.matchAll(ethers.utils.namehash(name).substring(2))].map((x) => x.index / 2 - 1);
const getDataForName = async ({ contracts, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, name, options) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const { data, calls } = await makeMulticallData({ _getAddr, _getContentHash, _getText, resolverMulticallWrapper }, name, options);
    let resolver;
    try {
        resolver = await universalResolver?.resolve(hexEncodeName(name), data);
    }
    catch {
        return null;
    }
    const [recordData] = await resolverMulticallWrapper.decode(resolver['0']);
    const matchAddress = recordData[calls.findIndex((x) => x.key === '60')];
    return {
        address: matchAddress && (await _getAddr.decode(matchAddress)),
        records: await formatRecords({ _getAddr, _getContentHash, _getText }, recordData, calls, options),
        resolverAddress: resolver['1'],
    };
};
const formatRecords = async ({ _getText, _getAddr, _getContentHash, }, data, calls, options) => {
    let returnedRecords = (await Promise.all(data.map(async (item, i) => {
        let decodedFromAbi;
        let itemRet = {
            key: calls[i].key,
            type: calls[i].type,
        };
        if (itemRet.type === 'addr' || itemRet.type === 'contenthash') {
            decodedFromAbi = ethers.utils.defaultAbiCoder.decode(['bytes'], item)[0];
            if (ethers.utils.hexStripZeros(decodedFromAbi) === '0x') {
                return null;
            }
        }
        switch (calls[i].type) {
            case 'text':
                itemRet = {
                    ...itemRet,
                    value: await _getText.decode(item),
                };
                if (itemRet.value === '')
                    return null;
                break;
            case 'addr':
                try {
                    const addr = await _getAddr.decode(item, '', calls[i].key);
                    if (addr) {
                        itemRet = {
                            ...itemRet,
                            ...addr,
                        };
                        break;
                    }
                    else {
                        return null;
                    }
                }
                catch {
                    return null;
                }
            case 'contenthash':
                try {
                    itemRet = {
                        ...itemRet,
                        value: await _getContentHash.decode(item),
                    };
                }
                catch {
                    return null;
                }
        }
        return itemRet;
    })))
        .filter((x) => {
        return typeof x === 'object';
    })
        .filter((x) => x !== null);
    let returnedResponse = {};
    if (typeof options.contentHash === 'string' ||
        typeof options.contentHash === 'object') {
        if (typeof options.contentHash === 'string' &&
            ethers.utils.hexStripZeros(options.contentHash) === '0x') {
            returnedResponse.contentHash = null;
        }
        else if (ethers.utils.isBytesLike(options.contentHash.decoded) &&
            ethers.utils.hexStripZeros(options.contentHash.decoded) === '0x') {
            returnedResponse.contentHash = null;
        }
        else {
            returnedResponse.contentHash = options.contentHash;
        }
    }
    else if (options.contentHash) {
        const foundRecord = returnedRecords.find((item) => item.type === 'contenthash');
        returnedResponse.contentHash = foundRecord ? foundRecord.value : null;
    }
    if (options.texts) {
        returnedResponse.texts = returnedRecords.filter((x) => x.type === 'text');
    }
    if (options.coinTypes) {
        returnedResponse.coinTypes = returnedRecords.filter((x) => x.type === 'addr');
    }
    return returnedResponse;
};
const graphFetch = async ({ gqlInstance }, name, wantedRecords) => {
    const query = gqlInstance.gql `
    query getRecords($name: String!) {
      domains(where: { name: $name }) {
        isMigrated
        createdAt
        resolver {
          texts
          coinTypes
          contentHash
          addr {
            id
          }
        }
      }
    }
  `;
    const client = gqlInstance.client;
    const { domains } = await client.request(query, { name });
    if (!domains || domains.length === 0)
        return null;
    const [{ resolver: resolverResponse, isMigrated, createdAt }] = domains;
    let returnedRecords = {};
    if (!wantedRecords)
        return { isMigrated, createdAt };
    Object.keys(wantedRecords).forEach((key) => {
        const data = wantedRecords[key];
        if (typeof data === 'boolean' && data) {
            if (key === 'contentHash') {
                returnedRecords[key] = decodeContenthash(resolverResponse.contentHash);
            }
            else {
                returnedRecords[key] = resolverResponse[key];
            }
        }
    });
    return { ...returnedRecords, isMigrated, createdAt };
};
const getProfileFromName = async ({ contracts, gqlInstance, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, name, options) => {
    const usingOptions = !options || options?.texts === true || options?.coinTypes === true
        ? options || { contentHash: true, texts: true, coinTypes: true }
        : undefined;
    const graphResult = await graphFetch({ gqlInstance }, name, usingOptions);
    if (!graphResult)
        return null;
    const { isMigrated, createdAt, ...wantedRecords } = graphResult;
    const result = await getDataForName({
        contracts,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
    }, name, usingOptions ? wantedRecords : options);
    if (!result)
        return { isMigrated, createdAt, message: "Records fetch didn't complete" };
    return { ...result, isMigrated, createdAt, message: undefined };
};
const getProfileFromAddress = async ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, address, options) => {
    let name;
    try {
        name = await getName(address);
    }
    catch {
        return null;
    }
    if (!name || !name.name || name.name === '')
        return null;
    if (!name.match)
        return { ...name, isMigrated: null, createdAt: null };
    const result = await getProfileFromName({
        contracts,
        gqlInstance,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
    }, name.name, options);
    if (!result || result.message)
        return null;
    delete result.address;
    return {
        ...result,
        ...name,
        message: undefined,
    };
};
export default async function ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, nameOrAddress, options) {
    if (options && options.coinTypes && typeof options.coinTypes !== 'boolean') {
        options.coinTypes = options.coinTypes.map((coin) => {
            if (!isNaN(parseInt(coin))) {
                return coin;
            }
            else {
                return `${formatsByName[coin.toUpperCase()].coinType}`;
            }
        });
    }
    const inputType = parseInputType(nameOrAddress);
    if (inputType.type === 'unknown' || inputType.info === 'unsupported') {
        throw new Error('Invalid input type');
    }
    if (inputType.type === 'address') {
        return getProfileFromAddress({
            contracts,
            gqlInstance,
            getName,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, nameOrAddress, options);
    }
    return getProfileFromName({
        contracts,
        gqlInstance,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
    }, nameOrAddress, options);
}
