export declare const dnsRegistrarErrors: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "InvalidPublicSuffix";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoOwnerRecordFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "offset";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "length";
        readonly type: "uint256";
    }];
    readonly name: "OffsetOutOfBoundsError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PreconditionNotMet";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StaleProof";
    readonly type: "error";
}];
export declare const dnsRegistrarProveAndClaimSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "InvalidPublicSuffix";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoOwnerRecordFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "offset";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "length";
        readonly type: "uint256";
    }];
    readonly name: "OffsetOutOfBoundsError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PreconditionNotMet";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StaleProof";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly components: readonly [{
            readonly name: "rrset";
            readonly type: "bytes";
        }, {
            readonly name: "sig";
            readonly type: "bytes";
        }];
        readonly name: "input";
        readonly type: "tuple[]";
    }];
    readonly name: "proveAndClaim";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const dnsRegistrarProveAndClaimWithResolverSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "InvalidPublicSuffix";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoOwnerRecordFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "offset";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "length";
        readonly type: "uint256";
    }];
    readonly name: "OffsetOutOfBoundsError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PreconditionNotMet";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StaleProof";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly components: readonly [{
            readonly internalType: "bytes";
            readonly name: "rrset";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "sig";
            readonly type: "bytes";
        }];
        readonly name: "input";
        readonly type: "tuple[]";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "proveAndClaimWithResolver";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
//# sourceMappingURL=dnsRegistrar.d.ts.map