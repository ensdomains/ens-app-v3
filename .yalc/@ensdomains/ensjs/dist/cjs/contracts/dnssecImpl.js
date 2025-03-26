"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnssecImplAnchorsSnippet = exports.dnssecImplVerifyRrSetSnippet = void 0;
exports.dnssecImplVerifyRrSetSnippet = [
    {
        inputs: [
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
        name: 'verifyRRSet',
        outputs: [
            {
                name: 'rrs',
                type: 'bytes',
            },
            {
                name: 'inception',
                type: 'uint32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.dnssecImplAnchorsSnippet = [
    {
        inputs: [],
        name: 'anchors',
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
//# sourceMappingURL=dnssecImpl.js.map