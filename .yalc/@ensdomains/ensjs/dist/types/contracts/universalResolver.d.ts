export declare const universalResolverErrors: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "returnData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "status";
            readonly type: "uint16";
        }, {
            readonly name: "message";
            readonly type: "string";
        }];
        readonly name: "errors";
        readonly type: "tuple[]";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}];
export declare const universalResolverReverseSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "returnData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "status";
            readonly type: "uint16";
        }, {
            readonly name: "message";
            readonly type: "string";
        }];
        readonly name: "errors";
        readonly type: "tuple[]";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "reverseName";
        readonly type: "bytes";
    }];
    readonly name: "reverse";
    readonly outputs: readonly [{
        readonly type: "string";
        readonly name: "resolvedName";
    }, {
        readonly type: "address";
        readonly name: "resolvedAddress";
    }, {
        readonly type: "address";
        readonly name: "reverseResolver";
    }, {
        readonly type: "address";
        readonly name: "resolver";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "reverseName";
        readonly type: "bytes";
    }, {
        readonly name: "gateways";
        readonly type: "string[]";
    }];
    readonly name: "reverse";
    readonly outputs: readonly [{
        readonly type: "string";
        readonly name: "resolvedName";
    }, {
        readonly type: "address";
        readonly name: "resolvedAddress";
    }, {
        readonly type: "address";
        readonly name: "reverseResolver";
    }, {
        readonly type: "address";
        readonly name: "resolver";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverResolveSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "returnData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "status";
            readonly type: "uint16";
        }, {
            readonly name: "message";
            readonly type: "string";
        }];
        readonly name: "errors";
        readonly type: "tuple[]";
    }];
    readonly name: "HttpError";
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
}, {
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
export declare const universalResolverResolveArraySnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "returnData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "status";
            readonly type: "uint16";
        }, {
            readonly name: "message";
            readonly type: "string";
        }];
        readonly name: "errors";
        readonly type: "tuple[]";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly name: "resolve";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "success";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly type: "bytes";
        }];
        readonly name: "";
        readonly type: "tuple[]";
    }, {
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "data";
        readonly type: "bytes[]";
    }, {
        readonly name: "gateways";
        readonly type: "string[]";
    }];
    readonly name: "resolve";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "success";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly type: "bytes";
        }];
        readonly name: "";
        readonly type: "tuple[]";
    }, {
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverFindResolverSnippet: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverNotContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "returnData";
        readonly type: "bytes";
    }];
    readonly name: "ResolverError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "status";
            readonly type: "uint16";
        }, {
            readonly name: "message";
            readonly type: "string";
        }];
        readonly name: "errors";
        readonly type: "tuple[]";
    }];
    readonly name: "HttpError";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }];
    readonly name: "findResolver";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=universalResolver.d.ts.map