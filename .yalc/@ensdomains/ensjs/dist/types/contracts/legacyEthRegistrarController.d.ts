export declare const legacyEthRegistrarControllerAvailableSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "available";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerCommitSnippet: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "commit";
    readonly outputs: readonly [];
    readonly payable: false;
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerCommitmentsSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "commitments";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerMakeCommitmentSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "secret";
        readonly type: "bytes32";
    }];
    readonly name: "makeCommitment";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly payable: false;
    readonly stateMutability: "pure";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerMakeCommitmentWithConfigSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "secret";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "makeCommitmentWithConfig";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly payable: false;
    readonly stateMutability: "pure";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerRegisterSnippet: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "duration";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes32";
        readonly name: "secret";
        readonly type: "bytes32";
    }];
    readonly name: "register";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerRegisterWithConfigSnippet: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "duration";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes32";
        readonly name: "secret";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "addr";
        readonly type: "address";
    }];
    readonly name: "registerWithConfig";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerRenewSnippet: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "uint256";
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "renew";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerRentPriceSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "uint256";
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "rentPrice";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerSupportsInterfaceSnippet: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly stateMutability: "pure";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerTransferOwnershipSnippet: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly payable: false;
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const legacyEthRegistrarControllerNameRegisteredEventSnippet: readonly [{
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "label";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "cost";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "expires";
        readonly type: "uint256";
    }];
    readonly name: "NameRegistered";
    readonly type: "event";
}];
//# sourceMappingURL=legacyEthRegistrarController.d.ts.map