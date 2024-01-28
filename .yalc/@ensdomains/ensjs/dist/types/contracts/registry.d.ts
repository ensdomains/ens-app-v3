export declare const registryOwnerSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const registrySetSubnodeRecordSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "label";
        readonly type: "bytes32";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "ttl";
        readonly type: "uint64";
    }];
    readonly name: "setSubnodeRecord";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const registryResolverSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "resolver";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const registrySetApprovalForAllSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "setApprovalForAll";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const registrySetResolverSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "setResolver";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const registrySetOwnerSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "setOwner";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const registrySetSubnodeOwnerSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "label";
        readonly type: "bytes32";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "setSubnodeOwner";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const registrySetRecordSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "ttl";
        readonly type: "uint64";
    }];
    readonly name: "setRecord";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
//# sourceMappingURL=registry.d.ts.map