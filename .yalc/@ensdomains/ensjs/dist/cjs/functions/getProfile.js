"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_encoder_1 = require("@ensdomains/address-encoder");
const ethers_1 = require("ethers");
const contentHash_1 = require("../utils/contentHash");
const hexEncodedName_1 = require("../utils/hexEncodedName");
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
const makeHashIndexes = (data, name) => [...data.matchAll(ethers_1.ethers.utils.namehash(name).substring(2))].map((x) => x.index / 2 - 1);
const getDataForName = async ({ contracts, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, name, options) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const { data, calls } = await makeMulticallData({ _getAddr, _getContentHash, _getText, resolverMulticallWrapper }, name, options);
    let resolver;
    try {
        resolver = await universalResolver?.resolve((0, hexEncodedName_1.hexEncodeName)(name), data);
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
const getDataForAddress = async ({ contracts, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, address, options) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const DNCOCURP = await contracts?.getDNCOCURP();
    const reverseNode = address.toLowerCase().substring(2) + '.addr.reverse';
    const { data, calls } = await makeMulticallData({ _getAddr, _getContentHash, _getText, resolverMulticallWrapper }, reverseNode, options);
    let result;
    try {
        result = await DNCOCURP?.reverse((0, hexEncodedName_1.hexEncodeName)(reverseNode), [
            {
                target: universalResolver.address,
                data: data,
                dataType: 0,
                locations: makeHashIndexes(data, reverseNode),
            },
        ]);
    }
    catch {
        return null;
    }
    const name = result.name;
    const URData = result.returnData[0];
    const [URDecoded, resolverAddress] = ethers_1.ethers.utils.defaultAbiCoder.decode(['bytes', 'address'], URData);
    const [recordData] = await resolverMulticallWrapper.decode(URDecoded);
    const matchAddress = recordData[calls.findIndex((x) => x.key === '60')];
    if (!matchAddress ||
        (await _getAddr.decode(matchAddress)).toLowerCase() !==
            address.toLowerCase()) {
        return { name, records: null, match: false };
    }
    return {
        name,
        records: await formatRecords({ _getAddr, _getContentHash, _getText }, recordData, calls, options),
        match: true,
        resolverAddress,
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
            decodedFromAbi = ethers_1.ethers.utils.defaultAbiCoder.decode(['bytes'], item)[0];
            if (ethers_1.ethers.utils.hexStripZeros(decodedFromAbi) === '0x') {
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
            ethers_1.ethers.utils.hexStripZeros(options.contentHash) === '0x') {
            returnedResponse.contentHash = null;
        }
        else if (ethers_1.ethers.utils.isBytesLike(options.contentHash.decoded) &&
            ethers_1.ethers.utils.hexStripZeros(options.contentHash.decoded) === '0x') {
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
    const [{ resolver: resolverResponse }] = domains;
    let returnedRecords = {};
    Object.keys(wantedRecords).forEach((key) => {
        const data = wantedRecords[key];
        if (typeof data === 'boolean' && data) {
            if (key === 'contentHash') {
                returnedRecords[key] = (0, contentHash_1.decodeContenthash)(resolverResponse.contentHash);
            }
            else {
                returnedRecords[key] = resolverResponse[key];
            }
        }
    });
    return returnedRecords;
};
const getProfileFromAddress = async ({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, address, options) => {
    if (!options ||
        (options && options.texts === true) ||
        options.coinTypes === true) {
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
            return { name, records: null, match: false };
        const wantedRecords = await graphFetch({ gqlInstance }, name.name, options || { contentHash: true, texts: true, coinTypes: true });
        if (!wantedRecords)
            return null;
        const result = await getDataForName({
            contracts,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, name.name, wantedRecords);
        if (!result)
            return null;
        delete result.address;
        return { ...result, match: true, name: name.name };
    }
    else {
        return await getDataForAddress({
            contracts,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, address, options);
    }
};
const getProfileFromName = async ({ contracts, gqlInstance, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, name, options) => {
    if (!options ||
        (options && options.texts === true) ||
        options.coinTypes === true) {
        const wantedRecords = await graphFetch({ gqlInstance }, name, options || { contentHash: true, texts: true, coinTypes: true });
        if (!wantedRecords)
            return null;
        return await getDataForName({
            contracts,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, name, wantedRecords);
    }
    else {
        return await getDataForName({
            contracts,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, name, options);
    }
};
async function default_1({ contracts, gqlInstance, getName, _getAddr, _getContentHash, _getText, resolverMulticallWrapper, }, nameOrAddress, options) {
    if (options && options.coinTypes && typeof options.coinTypes !== 'boolean') {
        options.coinTypes = options.coinTypes.map((coin) => {
            if (!isNaN(parseInt(coin))) {
                return coin;
            }
            else {
                return `${address_encoder_1.formatsByName[coin.toUpperCase()].coinType}`;
            }
        });
    }
    if (nameOrAddress.includes('.')) {
        return getProfileFromName({
            contracts,
            gqlInstance,
            _getAddr,
            _getContentHash,
            _getText,
            resolverMulticallWrapper,
        }, nameOrAddress, options);
    }
    else {
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
}
exports.default = default_1;
