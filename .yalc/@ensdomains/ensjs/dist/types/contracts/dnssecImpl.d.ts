export declare const dnssecImplVerifyRrSetSnippet: readonly [{
    readonly inputs: readonly [{
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
    readonly name: "verifyRRSet";
    readonly outputs: readonly [{
        readonly name: "rrs";
        readonly type: "bytes";
    }, {
        readonly name: "inception";
        readonly type: "uint32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const dnssecImplAnchorsSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "anchors";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=dnssecImpl.d.ts.map