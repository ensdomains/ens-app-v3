"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalResolverFindResolverSnippet = exports.universalResolverResolveWithGatewaysSnippet = exports.universalResolverResolveSnippet = exports.universalResolverReverseWithGatewaysSnippet = exports.universalResolverReverseSnippet = exports.universalResolverErrors = void 0;
exports.universalResolverErrors = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'dns',
                type: 'bytes',
            },
        ],
        name: 'DNSDecodingFailed',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'ens',
                type: 'string',
            },
        ],
        name: 'DNSEncodingFailed',
        type: 'error',
    },
    {
        inputs: [],
        name: 'EmptyAddress',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: 'status',
                type: 'uint16',
            },
            {
                internalType: 'string',
                name: 'message',
                type: 'string',
            },
        ],
        name: 'HttpError',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidBatchGatewayResponse',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'string[]',
                name: 'urls',
                type: 'string[]',
            },
            {
                internalType: 'bytes',
                name: 'callData',
                type: 'bytes',
            },
            {
                internalType: 'bytes4',
                name: 'callbackFunction',
                type: 'bytes4',
            },
            {
                internalType: 'bytes',
                name: 'extraData',
                type: 'bytes',
            },
        ],
        name: 'OffchainLookup',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'errorData',
                type: 'bytes',
            },
        ],
        name: 'ResolverError',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
            {
                internalType: 'address',
                name: 'resolver',
                type: 'address',
            },
        ],
        name: 'ResolverNotContract',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
        ],
        name: 'ResolverNotFound',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'primary',
                type: 'string',
            },
            {
                internalType: 'bytes',
                name: 'primaryAddress',
                type: 'bytes',
            },
        ],
        name: 'ReverseAddressMismatch',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'selector',
                type: 'bytes4',
            },
        ],
        name: 'UnsupportedResolverProfile',
        type: 'error',
    },
];
const universalResolverReverse = {
    inputs: [
        {
            name: 'encodedAddress',
            type: 'bytes',
        },
        {
            name: 'coinType',
            type: 'uint256',
        },
    ],
    name: 'reverse',
    outputs: [
        { type: 'string', name: 'name' },
        { type: 'address', name: 'resolver' },
        { type: 'address', name: 'reverseResolver' },
    ],
    stateMutability: 'view',
    type: 'function',
};
exports.universalResolverReverseSnippet = [
    ...exports.universalResolverErrors,
    universalResolverReverse,
];
exports.universalResolverReverseWithGatewaysSnippet = [
    ...exports.universalResolverErrors,
    {
        ...universalResolverReverse,
        name: 'reverseWithGateways',
        inputs: [
            ...universalResolverReverse.inputs,
            {
                name: 'gateways',
                type: 'string[]',
            },
        ],
    },
];
const universalResolverResolve = {
    inputs: [
        {
            name: 'name',
            type: 'bytes',
        },
        {
            name: 'data',
            type: 'bytes',
        },
    ],
    name: 'resolve',
    outputs: [
        {
            name: 'data',
            type: 'bytes',
        },
        {
            name: 'resolver',
            type: 'address',
        },
    ],
    stateMutability: 'view',
    type: 'function',
};
exports.universalResolverResolveSnippet = [
    ...exports.universalResolverErrors,
    universalResolverResolve,
];
exports.universalResolverResolveWithGatewaysSnippet = [
    ...exports.universalResolverErrors,
    {
        ...universalResolverResolve,
        name: 'resolveWithGateways',
        inputs: [
            ...universalResolverResolve.inputs,
            {
                name: 'gateways',
                type: 'string[]',
            },
        ],
    },
];
exports.universalResolverFindResolverSnippet = [
    ...exports.universalResolverErrors,
    {
        inputs: [
            {
                name: 'name',
                type: 'bytes',
            },
        ],
        name: 'findResolver',
        outputs: [
            {
                name: 'address',
                type: 'address',
            },
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'offset',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
//# sourceMappingURL=universalResolver.js.map