"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const multicall_js_1 = require("../../contracts/multicall.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const checkSafeUniversalResolverData_js_1 = require("../../utils/checkSafeUniversalResolverData.js");
const consts_js_1 = require("../../utils/consts.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const _getAbi_js_1 = require("./_getAbi.js");
const _getAddr_js_1 = require("./_getAddr.js");
const _getContentHash_js_1 = require("./_getContentHash.js");
const _getText_js_1 = require("./_getText.js");
const multicallWrapper_js_1 = require("./multicallWrapper.js");
const createCalls = (client, { name, texts, coins, abi, contentHash, }) => [
    ...(texts ?? []).map((text) => ({
        key: text,
        call: _getText_js_1.default.encode(client, { name, key: text }),
        type: 'text',
    })),
    ...(coins ?? []).map((coin) => ({
        key: coin,
        call: _getAddr_js_1.default.encode(client, { name, coin }),
        type: 'coin',
    })),
    ...(contentHash
        ? [
            {
                key: 'contentHash',
                call: _getContentHash_js_1.default.encode(client, { name }),
                type: 'contentHash',
            },
        ]
        : []),
    ...(abi
        ? [
            { key: 'abi', call: _getAbi_js_1.default.encode(client, { name }), type: 'abi' },
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
        const encoded = multicallWrapper_js_1.default.encode(client, {
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
    const to = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [
        (0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(name)),
        (0, viem_1.encodeFunctionData)({
            abi: multicall_js_1.multicallSnippet,
            args: [calls.map((c) => c.call.data)],
        }),
    ];
    return {
        to,
        ...(gatewayUrls
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverResolveWithGatewaysSnippet,
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
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverResolveSnippet,
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
            const decodedFromAbi = (0, viem_1.decodeAbiParameters)([{ type: 'bytes' }], item)[0];
            if (decodedFromAbi === '0x' || (0, viem_1.hexToBigInt)(decodedFromAbi) === 0n) {
                return { ...baseItem, value: null };
            }
        }
        catch {
        }
    }
    if (type === 'text') {
        const decodedFromAbi = await _getText_js_1.default.decode(client, item, {
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    if (type === 'coin') {
        const decodedFromAbi = await _getAddr_js_1.default.decode(client, item, {
            coin: key,
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    if (type === 'contentHash') {
        const decodedFromAbi = await _getContentHash_js_1.default.decode(client, item, {
            strict: false,
        });
        return { ...baseItem, value: decodedFromAbi };
    }
    const decodedFromAbi = await _getAbi_js_1.default.decode(client, item, {
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
    return { ...prev, abi: curr.value };
};
const decode = async (client, data, passthrough, { resolver, texts, coins, contentHash, abi, gatewayUrls, }) => {
    const { calls } = passthrough;
    let recordData = [];
    let resolverAddress;
    const emptyResult = createEmptyResult({ texts, coins, contentHash, abi });
    if (resolver?.address && !resolver.fallbackOnly) {
        const result = await multicallWrapper_js_1.default.decode(client, data, passthrough.calls.filter((c) => c).map((c) => c.call));
        resolverAddress = resolver.address;
        recordData = result.map((r) => r.returnData);
    }
    else {
        const isSafe = (0, checkSafeUniversalResolverData_js_1.checkSafeUniversalResolverData)(data, {
            strict: false,
            abi: gatewayUrls
                ? universalResolver_js_1.universalResolverResolveWithGatewaysSnippet
                : universalResolver_js_1.universalResolverResolveSnippet,
            args: passthrough.args,
            functionName: 'resolve',
            address: passthrough.address,
        });
        if (!isSafe)
            return {
                ...emptyResult,
                resolverAddress: consts_js_1.EMPTY_ADDRESS,
            };
        const result = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_js_1.universalResolverResolveSnippet,
            functionName: 'resolve',
            data,
        });
        [, resolverAddress] = result;
        recordData = (0, viem_1.decodeFunctionResult)({
            abi: multicall_js_1.multicallSnippet,
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
const getRecords = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getRecords;
//# sourceMappingURL=getRecords.js.map