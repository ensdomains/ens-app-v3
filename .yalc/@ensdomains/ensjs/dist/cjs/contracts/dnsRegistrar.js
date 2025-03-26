"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsRegistrarProveAndClaimWithResolverSnippet = exports.dnsRegistrarProveAndClaimSnippet = exports.dnsRegistrarErrors = void 0;
exports.dnsRegistrarErrors = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
        ],
        name: 'InvalidPublicSuffix',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NoOwnerRecordFound',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'offset',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'OffsetOutOfBoundsError',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'caller',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'PermissionDenied',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PreconditionNotMet',
        type: 'error',
    },
    {
        inputs: [],
        name: 'StaleProof',
        type: 'error',
    },
];
exports.dnsRegistrarProveAndClaimSnippet = [
    ...exports.dnsRegistrarErrors,
    {
        inputs: [
            {
                name: 'name',
                type: 'bytes',
            },
            {
                components: [
                    {
                        name: 'rrset',
                        type: 'bytes',
                    },
                    {
                        name: 'sig',
                        type: 'bytes',
                    },
                ],
                name: 'input',
                type: 'tuple[]',
            },
        ],
        name: 'proveAndClaim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.dnsRegistrarProveAndClaimWithResolverSnippet = [
    ...exports.dnsRegistrarErrors,
    {
        inputs: [
            {
                name: 'name',
                type: 'bytes',
            },
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'rrset',
                        type: 'bytes',
                    },
                    {
                        internalType: 'bytes',
                        name: 'sig',
                        type: 'bytes',
                    },
                ],
                name: 'input',
                type: 'tuple[]',
            },
            {
                name: 'resolver',
                type: 'address',
            },
            {
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'proveAndClaimWithResolver',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
//# sourceMappingURL=dnsRegistrar.js.map