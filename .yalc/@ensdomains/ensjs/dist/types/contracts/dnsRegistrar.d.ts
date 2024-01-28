export declare const dnsRegistrarProveAndClaimSnippet: readonly [{
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
    }, {
        readonly name: "proof";
        readonly type: "bytes";
    }];
    readonly name: "proveAndClaim";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const dnsRegistrarProveAndClaimWithResolverSnippet: readonly [{
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
    }, {
        readonly name: "proof";
        readonly type: "bytes";
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