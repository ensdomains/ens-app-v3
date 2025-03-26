"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkRenewalRenewAllSnippet = exports.bulkRenewalRentPriceSnippet = void 0;
exports.bulkRenewalRentPriceSnippet = [
    {
        inputs: [
            {
                name: 'names',
                type: 'string[]',
            },
            {
                name: 'duration',
                type: 'uint256',
            },
        ],
        name: 'rentPrice',
        outputs: [
            {
                name: 'total',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.bulkRenewalRenewAllSnippet = [
    {
        inputs: [
            {
                name: 'names',
                type: 'string[]',
            },
            {
                name: 'duration',
                type: 'uint256',
            },
        ],
        name: 'renewAll',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
];
//# sourceMappingURL=bulkRenewal.js.map