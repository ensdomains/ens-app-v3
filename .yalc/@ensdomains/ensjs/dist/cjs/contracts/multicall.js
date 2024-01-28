"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multicallGetCurrentBlockTimestampSnippet = exports.multicallTryAggregateSnippet = void 0;
exports.multicallTryAggregateSnippet = [
    {
        inputs: [
            {
                name: 'requireSuccess',
                type: 'bool',
            },
            {
                components: [
                    {
                        name: 'target',
                        type: 'address',
                    },
                    {
                        name: 'callData',
                        type: 'bytes',
                    },
                ],
                name: 'calls',
                type: 'tuple[]',
            },
        ],
        name: 'tryAggregate',
        outputs: [
            {
                components: [
                    {
                        name: 'success',
                        type: 'bool',
                    },
                    {
                        name: 'returnData',
                        type: 'bytes',
                    },
                ],
                name: 'returnData',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
];
exports.multicallGetCurrentBlockTimestampSnippet = [
    {
        inputs: [],
        name: 'getCurrentBlockTimestamp',
        outputs: [
            {
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
//# sourceMappingURL=multicall.js.map