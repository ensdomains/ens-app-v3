export const dnssecImplRrDataSnippet = [
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
export const dnssecImplAnchorsSnippet = [
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