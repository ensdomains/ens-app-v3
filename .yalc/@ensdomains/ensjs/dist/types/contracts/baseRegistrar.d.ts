export declare const baseRegistrarAvailableSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "available";
    readonly outputs: readonly [{
        readonly name: "available";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const baseRegistrarNameExpiresSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "nameExpires";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const baseRegistrarGracePeriodSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "GRACE_PERIOD";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const baseRegistrarReclaimSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "reclaim";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const baseRegistrarSafeTransferFromSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const baseRegistrarSafeTransferFromWithDataSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const baseRegistrarOwnerOfSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "ownerOf";
    readonly outputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=baseRegistrar.d.ts.map