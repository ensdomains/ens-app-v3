export declare const nameWrapperErrors: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}];
export declare const nameWrapperGetDataSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "getData";
    readonly outputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "fuses";
        readonly type: "uint32";
    }, {
        readonly name: "expiry";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const nameWrapperSetFusesSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "ownerControlledFuses";
        readonly type: "uint16";
    }];
    readonly name: "setFuses";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperSetChildFusesSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "parentNode";
        readonly type: "bytes32";
    }, {
        readonly name: "labelhash";
        readonly type: "bytes32";
    }, {
        readonly name: "fuses";
        readonly type: "uint32";
    }, {
        readonly name: "expiry";
        readonly type: "uint64";
    }];
    readonly name: "setChildFuses";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperSetSubnodeRecordSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "parentNode";
        readonly type: "bytes32";
    }, {
        readonly name: "label";
        readonly type: "string";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "ttl";
        readonly type: "uint64";
    }, {
        readonly name: "fuses";
        readonly type: "uint32";
    }, {
        readonly name: "expiry";
        readonly type: "uint64";
    }];
    readonly name: "setSubnodeRecord";
    readonly outputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperSetRecordSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
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
export declare const nameWrapperSetSubnodeOwnerSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "parentNode";
        readonly type: "bytes32";
    }, {
        readonly name: "label";
        readonly type: "string";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "fuses";
        readonly type: "uint32";
    }, {
        readonly name: "expiry";
        readonly type: "uint64";
    }];
    readonly name: "setSubnodeOwner";
    readonly outputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperWrapSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "wrappedOwner";
        readonly type: "address";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "wrap";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperUnwrapSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "parentNode";
        readonly type: "bytes32";
    }, {
        readonly name: "labelhash";
        readonly type: "bytes32";
    }, {
        readonly name: "controller";
        readonly type: "address";
    }];
    readonly name: "unwrap";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperUnwrapEth2ldSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelhash";
        readonly type: "bytes32";
    }, {
        readonly name: "registrant";
        readonly type: "address";
    }, {
        readonly name: "controller";
        readonly type: "address";
    }];
    readonly name: "unwrapETH2LD";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperNamesSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "names";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const nameWrapperSafeTransferFromSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const nameWrapperOwnerOfSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
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
export declare const nameWrapperSetResolverSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "CannotUpgrade";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncompatibleParent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "IncorrectTargetOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "IncorrectTokenType";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "labelHash";
        readonly type: "bytes32";
    }, {
        readonly name: "expectedLabelhash";
        readonly type: "bytes32";
    }];
    readonly name: "LabelMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "label";
        readonly type: "string";
    }];
    readonly name: "LabelTooLong";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LabelTooShort";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NameIsNotWrapped";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "OperationProhibited";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "Unauthorised";
    readonly type: "error";
}, {
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
//# sourceMappingURL=nameWrapper.d.ts.map