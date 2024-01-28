export const registryOwnerSnippet = [
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
export const registrySetSubnodeRecordSnippet = [
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
export const registryResolverSnippet = [
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
export const registrySetApprovalForAllSnippet = [
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
export const registrySetResolverSnippet = [
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
export const registrySetOwnerSnippet = [
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
export const registrySetSubnodeOwnerSnippet = [
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
export const registrySetRecordSnippet = [
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