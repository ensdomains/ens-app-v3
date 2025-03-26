export declare const multicallTryAggregateSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "requireSuccess";
        readonly type: "bool";
    }, {
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
        }];
        readonly name: "calls";
        readonly type: "tuple[]";
    }];
    readonly name: "tryAggregate";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "success";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly type: "bytes";
        }];
        readonly name: "returnData";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const multicallSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly name: "multicall";
    readonly outputs: readonly [{
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const multicallGetCurrentBlockTimestampSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "getCurrentBlockTimestamp";
    readonly outputs: readonly [{
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=multicall.d.ts.map