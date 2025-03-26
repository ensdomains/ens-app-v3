"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRegistrarOwnerOfSnippet = exports.baseRegistrarSafeTransferFromWithDataSnippet = exports.baseRegistrarSafeTransferFromSnippet = exports.baseRegistrarReclaimSnippet = exports.baseRegistrarGracePeriodSnippet = exports.baseRegistrarNameExpiresSnippet = exports.baseRegistrarAvailableSnippet = void 0;
const erc721_js_1 = require("./erc721.js");
exports.baseRegistrarAvailableSnippet = [
    {
        inputs: [
            {
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'available',
        outputs: [
            {
                name: 'available',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.baseRegistrarNameExpiresSnippet = [
    {
        inputs: [
            {
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'nameExpires',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.baseRegistrarGracePeriodSnippet = [
    {
        inputs: [],
        name: 'GRACE_PERIOD',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.baseRegistrarReclaimSnippet = [
    {
        inputs: [
            {
                name: 'id',
                type: 'uint256',
            },
            {
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'reclaim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.baseRegistrarSafeTransferFromSnippet = [
    ...erc721_js_1.erc721SafeTransferFromSnippet,
];
exports.baseRegistrarSafeTransferFromWithDataSnippet = [
    ...erc721_js_1.erc721SafeTransferFromWithDataSnippet,
];
exports.baseRegistrarOwnerOfSnippet = [...erc721_js_1.erc721OwnerOfSnippet];
//# sourceMappingURL=baseRegistrar.js.map