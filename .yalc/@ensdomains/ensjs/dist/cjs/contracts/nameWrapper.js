"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameWrapperSetResolverSnippet = exports.nameWrapperOwnerOfSnippet = exports.nameWrapperSafeTransferFromSnippet = exports.nameWrapperNamesSnippet = exports.nameWrapperUnwrapEth2ldSnippet = exports.nameWrapperUnwrapSnippet = exports.nameWrapperWrapSnippet = exports.nameWrapperSetSubnodeOwnerSnippet = exports.nameWrapperSetRecordSnippet = exports.nameWrapperSetSubnodeRecordSnippet = exports.nameWrapperSetChildFusesSnippet = exports.nameWrapperSetFusesSnippet = exports.nameWrapperGetDataSnippet = exports.nameWrapperErrors = void 0;
const erc1155_js_1 = require("./erc1155.js");
const erc721_js_1 = require("./erc721.js");
const registry_js_1 = require("./registry.js");
exports.nameWrapperErrors = [
    {
        inputs: [],
        name: 'CannotUpgrade',
        type: 'error',
    },
    {
        inputs: [],
        name: 'IncompatibleParent',
        type: 'error',
    },
    {
        inputs: [
            {
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'IncorrectTargetOwner',
        type: 'error',
    },
    {
        inputs: [],
        name: 'IncorrectTokenType',
        type: 'error',
    },
    {
        inputs: [
            {
                name: 'labelHash',
                type: 'bytes32',
            },
            {
                name: 'expectedLabelhash',
                type: 'bytes32',
            },
        ],
        name: 'LabelMismatch',
        type: 'error',
    },
    {
        inputs: [
            {
                name: 'label',
                type: 'string',
            },
        ],
        name: 'LabelTooLong',
        type: 'error',
    },
    {
        inputs: [],
        name: 'LabelTooShort',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NameIsNotWrapped',
        type: 'error',
    },
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'OperationProhibited',
        type: 'error',
    },
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'Unauthorised',
        type: 'error',
    },
];
exports.nameWrapperGetDataSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'getData',
        outputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'fuses',
                type: 'uint32',
            },
            {
                name: 'expiry',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.nameWrapperSetFusesSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
            {
                name: 'ownerControlledFuses',
                type: 'uint16',
            },
        ],
        name: 'setFuses',
        outputs: [
            {
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperSetChildFusesSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'parentNode',
                type: 'bytes32',
            },
            {
                name: 'labelhash',
                type: 'bytes32',
            },
            {
                name: 'fuses',
                type: 'uint32',
            },
            {
                name: 'expiry',
                type: 'uint64',
            },
        ],
        name: 'setChildFuses',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperSetSubnodeRecordSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'parentNode',
                type: 'bytes32',
            },
            {
                name: 'label',
                type: 'string',
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
            {
                name: 'fuses',
                type: 'uint32',
            },
            {
                name: 'expiry',
                type: 'uint64',
            },
        ],
        name: 'setSubnodeRecord',
        outputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperSetRecordSnippet = [
    ...exports.nameWrapperErrors,
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
exports.nameWrapperSetSubnodeOwnerSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'parentNode',
                type: 'bytes32',
            },
            {
                name: 'label',
                type: 'string',
            },
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'fuses',
                type: 'uint32',
            },
            {
                name: 'expiry',
                type: 'uint64',
            },
        ],
        name: 'setSubnodeOwner',
        outputs: [
            {
                name: 'node',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperWrapSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'name',
                type: 'bytes',
            },
            {
                name: 'wrappedOwner',
                type: 'address',
            },
            {
                name: 'resolver',
                type: 'address',
            },
        ],
        name: 'wrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperUnwrapSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'parentNode',
                type: 'bytes32',
            },
            {
                name: 'labelhash',
                type: 'bytes32',
            },
            {
                name: 'controller',
                type: 'address',
            },
        ],
        name: 'unwrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperUnwrapEth2ldSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: 'labelhash',
                type: 'bytes32',
            },
            {
                name: 'registrant',
                type: 'address',
            },
            {
                name: 'controller',
                type: 'address',
            },
        ],
        name: 'unwrapETH2LD',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.nameWrapperNamesSnippet = [
    ...exports.nameWrapperErrors,
    {
        inputs: [
            {
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'names',
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
exports.nameWrapperSafeTransferFromSnippet = [
    ...exports.nameWrapperErrors,
    ...erc1155_js_1.erc1155SafeTransferFromSnippet,
];
exports.nameWrapperOwnerOfSnippet = [
    ...exports.nameWrapperErrors,
    ...erc721_js_1.erc721OwnerOfSnippet,
];
exports.nameWrapperSetResolverSnippet = [
    ...exports.nameWrapperErrors,
    ...registry_js_1.registrySetResolverSnippet,
];
//# sourceMappingURL=nameWrapper.js.map