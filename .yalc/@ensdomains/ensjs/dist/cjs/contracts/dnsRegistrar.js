"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsRegistrarProveAndClaimWithResolverSnippet = exports.dnsRegistrarProveAndClaimSnippet = void 0;
exports.dnsRegistrarProveAndClaimSnippet = [
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
            {
                name: 'proof',
                type: 'bytes',
            },
        ],
        name: 'proveAndClaim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.dnsRegistrarProveAndClaimWithResolverSnippet = [
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
            {
                name: 'proof',
                type: 'bytes',
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