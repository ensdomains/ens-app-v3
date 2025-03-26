"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyEthRegistrarControllerNameRegisteredEventSnippet = exports.legacyEthRegistrarControllerTransferOwnershipSnippet = exports.legacyEthRegistrarControllerSupportsInterfaceSnippet = exports.legacyEthRegistrarControllerRentPriceSnippet = exports.legacyEthRegistrarControllerRenewSnippet = exports.legacyEthRegistrarControllerRegisterWithConfigSnippet = exports.legacyEthRegistrarControllerRegisterSnippet = exports.legacyEthRegistrarControllerMakeCommitmentWithConfigSnippet = exports.legacyEthRegistrarControllerMakeCommitmentSnippet = exports.legacyEthRegistrarControllerCommitmentsSnippet = exports.legacyEthRegistrarControllerCommitSnippet = exports.legacyEthRegistrarControllerAvailableSnippet = void 0;
exports.legacyEthRegistrarControllerAvailableSnippet = [
    {
        constant: true,
        inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
        name: 'available',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerCommitSnippet = [
    {
        constant: false,
        inputs: [{ internalType: 'bytes32', name: 'commitment', type: 'bytes32' }],
        name: 'commit',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerCommitmentsSnippet = [
    {
        constant: true,
        inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        name: 'commitments',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerMakeCommitmentSnippet = [
    {
        constant: true,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
        ],
        name: 'makeCommitment',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerMakeCommitmentWithConfigSnippet = [
    {
        constant: true,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
            { internalType: 'address', name: 'resolver', type: 'address' },
            { internalType: 'address', name: 'addr', type: 'address' },
        ],
        name: 'makeCommitmentWithConfig',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerRegisterSnippet = [
    {
        constant: false,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
            { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
        ],
        name: 'register',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerRegisterWithConfigSnippet = [
    {
        constant: false,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
            { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
            { internalType: 'address', name: 'resolver', type: 'address' },
            { internalType: 'address', name: 'addr', type: 'address' },
        ],
        name: 'registerWithConfig',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerRenewSnippet = [
    {
        constant: false,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
        ],
        name: 'renew',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerRentPriceSnippet = [
    {
        constant: true,
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
        ],
        name: 'rentPrice',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerSupportsInterfaceSnippet = [
    {
        constant: true,
        inputs: [{ internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerTransferOwnershipSnippet = [
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.legacyEthRegistrarControllerNameRegisteredEventSnippet = [
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'string', name: 'name', type: 'string' },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'label',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'cost',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'expires',
                type: 'uint256',
            },
        ],
        name: 'NameRegistered',
        type: 'event',
    },
];
//# sourceMappingURL=legacyEthRegistrarController.js.map