"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrySetRecordSnippet = exports.registrySetSubnodeOwnerSnippet = exports.registrySetOwnerSnippet = exports.registrySetResolverSnippet = exports.registrySetApprovalForAllSnippet = exports.registryResolverSnippet = exports.registrySetSubnodeRecordSnippet = exports.registryOwnerSnippet = void 0;
exports.registryOwnerSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'owner',
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
exports.registrySetSubnodeRecordSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'label',
                type: 'bytes32',
            },
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'resolver',
                type: 'address',
            },
            {
                name: 'ttl',
                type: 'uint64',
            },
        ],
        name: 'setSubnodeRecord',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.registryResolverSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'resolver',
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
exports.registrySetApprovalForAllSnippet = [
    {
        inputs: [
            {
                name: 'operator',
                type: 'address',
            },
            {
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.registrySetResolverSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'resolver',
                type: 'address',
            },
        ],
        name: 'setResolver',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.registrySetOwnerSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'setOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.registrySetSubnodeOwnerSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'label',
                type: 'bytes32',
            },
            {
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'setSubnodeOwner',
        outputs: [
            {
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.registrySetRecordSnippet = [
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'resolver',
                type: 'address',
            },
            {
                name: 'ttl',
                type: 'uint64',
            },
        ],
        name: 'setRecord',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
//# sourceMappingURL=registry.js.map