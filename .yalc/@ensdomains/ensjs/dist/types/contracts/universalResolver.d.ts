export declare const universalResolverErrors: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}];
export declare const universalResolverReverseSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "encodedAddress";
        readonly type: "bytes";
    }, {
        readonly name: "coinType";
        readonly type: "uint256";
    }];
    readonly name: "reverse";
    readonly outputs: readonly [{
        readonly type: "string";
        readonly name: "name";
    }, {
        readonly type: "address";
        readonly name: "resolver";
    }, {
        readonly type: "address";
        readonly name: "reverseResolver";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverReverseWithGatewaysSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}, {
    readonly name: "reverseWithGateways";
    readonly inputs: readonly [{
        readonly name: "encodedAddress";
        readonly type: "bytes";
    }, {
        readonly name: "coinType";
        readonly type: "uint256";
    }, {
        readonly name: "gateways";
        readonly type: "string[]";
    }];
    readonly outputs: readonly [{
        readonly type: "string";
        readonly name: "name";
    }, {
        readonly type: "address";
        readonly name: "resolver";
    }, {
        readonly type: "address";
        readonly name: "reverseResolver";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverResolveSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "resolve";
    readonly outputs: readonly [{
        readonly name: "data";
        readonly type: "bytes";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverResolveWithGatewaysSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}, {
    readonly name: "resolveWithGateways";
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }, {
        readonly name: "gateways";
        readonly type: "string[]";
    }];
    readonly outputs: readonly [{
        readonly name: "data";
        readonly type: "bytes";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverFindResolverSnippet: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "dns";
        readonly type: "bytes";
    }];
    readonly name: "DNSDecodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "ens";
        readonly type: "string";
    }];
    readonly name: "DNSEncodingFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "status";
        readonly type: "uint16";
    }, {
        readonly internalType: "string";
        readonly name: "message";
        readonly type: "string";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBatchGatewayResponse";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "string[]";
        readonly name: "urls";
        readonly type: "string[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "callData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes4";
        readonly name: "callbackFunction";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes";
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "OffchainLookup";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "errorData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "resolver";
        readonly type: "address";
    }];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "primary";
        readonly type: "string";
    }, {
        readonly internalType: "bytes";
        readonly name: "primaryAddress";
        readonly type: "bytes";
    }];
    readonly name: "ReverseAddressMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector";
        readonly type: "bytes4";
    }];
    readonly name: "UnsupportedResolverProfile";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "findResolver";
    readonly outputs: readonly [{
        readonly name: "address";
        readonly type: "address";
    }, {
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly name: "offset";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=universalResolver.d.ts.map