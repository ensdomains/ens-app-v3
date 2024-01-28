"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseRegistrarSetNameSnippet = exports.reverseRegistrarSetNameForAddrSnippet = void 0;
exports.reverseRegistrarSetNameForAddrSnippet = [
    {
        inputs: [
            {
                name: 'addr',
                type: 'address',
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
                name: 'name',
                type: 'string',
            },
        ],
        name: 'setNameForAddr',
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
exports.reverseRegistrarSetNameSnippet = [
    {
        inputs: [
            {
                name: 'name',
                type: 'string',
            },
        ],
        name: 'setName',
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
//# sourceMappingURL=reverseRegistrar.js.map