export declare const publicResolverSingleAddrSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "addr";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const publicResolverMultiAddrSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "coinType";
        readonly type: "uint256";
    }];
    readonly name: "addr";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const publicResolverTextSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "key";
        readonly type: "string";
    }];
    readonly name: "text";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const publicResolverContenthashSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "contenthash";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const publicResolverAbiSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "contentTypes";
        readonly type: "uint256";
    }];
    readonly name: "ABI";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const publicResolverSetTextSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "key";
        readonly type: "string";
    }, {
        readonly name: "value";
        readonly type: "string";
    }];
    readonly name: "setText";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const publicResolverSetAddrSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "coinType";
        readonly type: "uint256";
    }, {
        readonly name: "a";
        readonly type: "bytes";
    }];
    readonly name: "setAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const publicResolverSetAbiSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "contentType";
        readonly type: "uint256";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "setABI";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const publicResolverSetContenthashSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "hash";
        readonly type: "bytes";
    }];
    readonly name: "setContenthash";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const publicResolverClearRecordsSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "clearRecords";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const publicResolverMulticallSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly name: "multicall";
    readonly outputs: readonly [{
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
//# sourceMappingURL=publicResolver.d.ts.map