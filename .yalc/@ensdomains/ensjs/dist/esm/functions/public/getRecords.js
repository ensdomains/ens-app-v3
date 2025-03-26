import { BaseError, decodeAbiParameters, decodeFunctionResult, encodeFunctionData, hexToBigInt, toHex, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { multicallSnippet } from '../../contracts/multicall.js';
import { universalResolverResolveSnippet, universalResolverResolveWithGatewaysSnippet, } from '../../contracts/universalResolver.js';
import { checkSafeUniversalResolverData } from '../../utils/checkSafeUniversalResolverData.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { generateFunction } from '../../utils/generateFunction.js';
import { packetToBytes } from '../../utils/hexEncodedName.js';
import _getAbi, {} from './_getAbi.js';
import _getAddr from './_getAddr.js';
import _getContentHash, {} from './_getContentHash.js';
import _getText from './_getText.js';
import multicallWrapper from './multicallWrapper.js';
const createCalls = (client, { name, texts, coins, abi, contentHash, }) => [
    ...(texts ?? []).map((text) => ({
        key: text,
        call: _getText.encode(client, { name, key: text }),
        type: 'text',
    })),
    ...(coins ?? []).map((coin) => ({
        key: coin,
        call: _getAddr.encode(client, { name, coin }),
        type: 'coin',
    })),
    ...(contentHash
        ? [
            {
                key: 'contentHash',
                call: _getContentHash.encode(client, { name }),
                type: 'contentHash',
            },
        ]
        : []),
    ...(abi
        ? [
            { key: 'abi', call: _getAbi.encode(client, { name }), type: 'abi' },
        ]
        : []),
];
const encode = (client, { name, resolver, texts, coins, contentHash, abi, gatewayUrls, }) => {
    const calls = createCalls(client, {
        name,
        texts,
        coins,
        contentHash,
        abi,
    });
    if (resolver?.address && !resolver.fallbackOnly) {
        const encoded = multicallWrapper.encode(client, {
            transactions: calls.map((c) => ({
                to: resolver.address,
                data: c.call.data,
            })),
        });
        return {
            ...encoded,
            passthrough: { calls },
        };
    }
    const to = getChainContractAddress({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [
        toHex(packetToBytes(name)),
        encodeFunctionData({
            abi: multicallSnippet,
            args: [calls.map((c) => c.call.data)],
        }),
    ];
    return {
        to,
        ...(gatewayUrls
            ? {
                data: encodeFunctionData({
                    abi: universalResolverResolveWithGatewaysSnippet,
                    functionName: 'resolveWithGateways',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    calls,
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: encodeFunctionData({
                    abi: universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args,
                }),
                passthrough: {
                    calls,
                    args,
                    address: to,
                },
            }),
    };
};
const createEmptyResult = ({ texts, coins, abi, contentHash, }) => ({
    ...(texts ? { texts: [] } : {}),
    ...(coins ? { coins: [] } : {}),
    ...(contentHash ? { contentHash: null } : {}),
    ...(abi ? { abi: null } : {}),
});
const decodeRecord = async (client, { item, call }) => {
    const { key, type } = call;
    const baseItem = { key, type };
    if (type === 'contentHash') {
        try {
            const decodedFromAbi = decodeAbiParameters([{ type: 'bytes' }], item)[0];
            if (decodedFromAbi === '0x' || hexToBigInt(decodedFromAbi) === 0n) {
                return { ...baseItem, value: null };
            }
        }
        catch {
            // ignore
        }
    }
    if (type === 'text') {
        const decodedFromAbi = await _getText.decode(client, item, {
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    if (type === 'coin') {
        const decodedFromAbi = await _getAddr.decode(client, item, {
            coin: key,
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    if (type === 'contentHash') {
        const decodedFromAbi = await _getContentHash.decode(client, item, {
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    // abi
    const decodedFromAbi = await _getAbi.decode(client, item, {
        strict: false,
    });
    return { ...baseItem, value: decodedFromAbi };
};
const createRecordResult = (prev, curr) => {
    if (curr.type === 'text' || curr.type === 'coin') {
        if (!curr.value) {
            return prev;
        }
    }
    if (curr.type === 'text') {
        return {
            ...prev,
            texts: [
                ...(prev.texts || []),
                { key: curr.key, value: curr.value },
            ],
        };
    }
    if (curr.type === 'coin') {
        return {
            ...prev,
            coins: [...(prev.coins || []), curr.value],
        };
    }
    if (curr.type === 'contentHash') {
        return {
            ...prev,
            contentHash: curr.value,
        };
    }
    // abi
    return { ...prev, abi: curr.value };
};
const decode = async (client, data, passthrough, { resolver, texts, coins, contentHash, abi, gatewayUrls, }) => {
    const { calls } = passthrough;
    let recordData = [];
    let resolverAddress;
    const emptyResult = createEmptyResult({ texts, coins, contentHash, abi });
    if (resolver?.address && !resolver.fallbackOnly) {
        const result = await multicallWrapper.decode(client, data, passthrough.calls.filter((c) => c).map((c) => c.call));
        resolverAddress = resolver.address;
        recordData = result.map((r) => r.returnData);
    }
    else {
        const isSafe = checkSafeUniversalResolverData(data, {
            strict: false,
            abi: gatewayUrls
                ? universalResolverResolveWithGatewaysSnippet
                : universalResolverResolveSnippet,
            args: passthrough.args,
            functionName: 'resolve',
            address: passthrough.address,
        });
        if (!isSafe)
            return {
                ...emptyResult,
                resolverAddress: EMPTY_ADDRESS,
            };
        const result = decodeFunctionResult({
            abi: universalResolverResolveSnippet,
            functionName: 'resolve',
            data,
        });
        [, resolverAddress] = result;
        recordData = decodeFunctionResult({
            abi: multicallSnippet,
            data: result[0],
        }).map((r) => {
            if (r === '0x')
                return null;
            return (r.length - 2) % 32 === 0 ? r : null;
        });
    }
    const filteredCalls = calls.filter((x) => x);
    const filteredRecordData = recordData.filter((x) => x);
    const decodedRecords = await Promise.all(filteredRecordData.map(async (item, i) => decodeRecord(client, { item, call: filteredCalls[i] })));
    const records = decodedRecords.reduce(createRecordResult, {
        ...emptyResult,
        resolverAddress,
    });
    return records;
};
/**
 * Gets arbitrary records for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetRecordsParameters}
 * @returns Records data object. {@link GetRecordsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getRecords } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getRecords(client, {
 *   name: 'ens.eth',
 *   texts: ['com.twitter', 'com.github'],
 *   coins: ['ETH'],
 *   contentHash: true,
 * })
 * // { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
 */
const getRecords = generateFunction({ encode, decode });
export default getRecords;
//# sourceMappingURL=getRecords.js.map