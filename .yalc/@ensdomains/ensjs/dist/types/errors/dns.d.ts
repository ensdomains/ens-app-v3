import { BaseError } from './base.js';
export declare class DnsResponseStatusError extends BaseError {
    responseStatus: string;
    name: string;
    constructor({ responseStatus }: {
        responseStatus: string;
    });
}
export declare class DnsDnssecVerificationFailedError extends BaseError {
    record: string | undefined;
    name: string;
    constructor({ record }: {
        record: string | undefined;
    });
}
export declare class DnsDnssecWildcardExpansionError extends BaseError {
    name: string;
    constructor();
}
export declare class DnsNoTxtRecordError extends BaseError {
    name: string;
    constructor();
}
export declare class DnsInvalidTxtRecordError extends BaseError {
    record: string;
    name: string;
    constructor({ record }: {
        record: string;
    });
}
export declare class DnsInvalidAddressChecksumError extends BaseError {
    address: string;
    name: string;
    constructor({ address }: {
        address: string;
    });
}
export declare class DnsNewerRecordTypeAvailableError extends BaseError {
    typeCovered: string;
    signatureName: string;
    onchainInception: number;
    dnsInception: number;
    name: string;
    constructor({ typeCovered, signatureName, onchainInception, dnsInception, }: {
        typeCovered: string;
        signatureName: string;
        onchainInception: number;
        dnsInception: number;
    });
}
//# sourceMappingURL=dns.d.ts.map