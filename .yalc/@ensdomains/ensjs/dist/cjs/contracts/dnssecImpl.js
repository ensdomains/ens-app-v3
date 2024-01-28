"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnssecImplAnchorsSnippet = exports.dnssecImplRrDataSnippet = void 0;
exports.dnssecImplRrDataSnippet = [
    {
        inputs: [
            {
                name: 'dnstype',
                type: 'uint16',
            },
            {
                name: 'name',
                type: 'bytes',
            },
        ],
        name: 'rrdata',
        outputs: [
            {
                name: '',
                type: 'uint32',
            },
            {
                name: '',
                type: 'uint32',
            },
            {
                name: '',
                type: 'bytes20',
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