"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicResolverMulticallSnippet = exports.publicResolverClearRecordsSnippet = exports.publicResolverSetContenthashSnippet = exports.publicResolverSetAbiSnippet = exports.publicResolverSetAddrSnippet = exports.publicResolverSetTextSnippet = exports.publicResolverAbiSnippet = exports.publicResolverContenthashSnippet = exports.publicResolverTextSnippet = exports.publicResolverMultiAddrSnippet = exports.publicResolverSingleAddrSnippet = void 0;
exports.publicResolverSingleAddrSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'addr',
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.publicResolverMultiAddrSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'coinType',
                type: 'uint256',
            },
        ],
        name: 'addr',
        outputs: [
            {
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.publicResolverTextSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'key',
                type: 'string',
            },
        ],
        name: 'text',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.publicResolverContenthashSnippet = [
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'contenthash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.publicResolverAbiSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'contentTypes',
                type: 'uint256',
            },
        ],
        name: 'ABI',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.publicResolverSetTextSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'key',
                type: 'string',
            },
            {
                name: 'value',
                type: 'string',
            },
        ],
        name: 'setText',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.publicResolverSetAddrSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'coinType',
                type: 'uint256',
            },
            {
                name: 'a',
                type: 'bytes',
            },
        ],
        name: 'setAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.publicResolverSetAbiSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'contentType',
                type: 'uint256',
            },
            {
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'setABI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.publicResolverSetContenthashSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'hash',
                type: 'bytes',
            },
        ],
        name: 'setContenthash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.publicResolverClearRecordsSnippet = [
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'clearRecords',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.publicResolverMulticallSnippet = [
    {
        inputs: [
            {
                name: 'data',
                type: 'bytes[]',
            },
        ],
        name: 'multicall',
        outputs: [
            {
                name: 'results',
                type: 'bytes[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
//# sourceMappingURL=publicResolver.js.map