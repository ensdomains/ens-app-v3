export declare const ethRegistrarControllerErrors: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}];
export declare const ethRegistrarControllerRentPriceSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "rentPrice";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "base";
            readonly type: "uint256";
        }, {
            readonly name: "premium";
            readonly type: "uint256";
        }];
        readonly name: "price";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const ethRegistrarControllerCommitSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "commit";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const ethRegistrarControllerCommitmentsSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "commitments";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const ethRegistrarControllerRegisterSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }, {
        readonly name: "secret";
        readonly type: "bytes32";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "data";
        readonly type: "bytes[]";
    }, {
        readonly name: "reverseRecord";
        readonly type: "bool";
    }, {
        readonly name: "ownerControlledFuses";
        readonly type: "uint16";
    }];
    readonly name: "register";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const ethRegistrarControllerRenewSnippet: readonly [{
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooNew";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "CommitmentTooOld";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "DurationTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MaxCommitmentAgeTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverRequiredWhenDataSupplied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "UnexpiredCommitmentExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "renew";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
//# sourceMappingURL=ethRegistrarController.d.ts.map