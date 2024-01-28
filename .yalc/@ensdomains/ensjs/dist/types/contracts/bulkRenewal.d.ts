export declare const bulkRenewalRentPriceSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "names";
        readonly type: "string[]";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "rentPrice";
    readonly outputs: readonly [{
        readonly name: "total";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const bulkRenewalRenewAllSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "names";
        readonly type: "string[]";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "renewAll";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
//# sourceMappingURL=bulkRenewal.d.ts.map