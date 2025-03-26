import { BaseError } from './base.js';
export class DnsResponseStatusError extends BaseError {
    constructor({ responseStatus }) {
        super(`DNS query failed with status: ${responseStatus}`);
        Object.defineProperty(this, "responseStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsResponseStatusError'
        });
        this.responseStatus = responseStatus;
    }
}
export class DnsDnssecVerificationFailedError extends BaseError {
    constructor({ record }) {
        super('DNSSEC verification failed');
        Object.defineProperty(this, "record", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsDnssecVerificationFailedError'
        });
        this.record = record;
    }
}
export class DnsDnssecWildcardExpansionError extends BaseError {
    constructor() {
        super('DNSSEC wildcard expansion not supported');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsDnssecWildcardExpansionError'
        });
    }
}
export class DnsNoTxtRecordError extends BaseError {
    constructor() {
        super('No TXT record found');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsNoTxtRecordError'
        });
    }
}
export class DnsInvalidTxtRecordError extends BaseError {
    constructor({ record }) {
        super(`Invalid TXT record: ${record}`);
        Object.defineProperty(this, "record", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsInvalidTxtRecordError'
        });
        this.record = record;
    }
}
export class DnsInvalidAddressChecksumError extends BaseError {
    constructor({ address }) {
        super(`Invalid address checksum: ${address}`);
        Object.defineProperty(this, "address", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsInvalidAddressChecksumError'
        });
        this.address = address;
    }
}
export class DnsNewerRecordTypeAvailableError extends BaseError {
    constructor({ typeCovered, signatureName, onchainInception, dnsInception, }) {
        super(`DNSSEC Oracle has a newer version of the ${typeCovered} RRSET on ${signatureName}`, {
            metaMessages: [
                `- Onchain inception: ${onchainInception}`,
                `- DNS inception: ${dnsInception}`,
            ],
        });
        Object.defineProperty(this, "typeCovered", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signatureName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onchainInception", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dnsInception", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'DnsNewerRecordTypeAvailableError'
        });
        this.typeCovered = typeCovered;
        this.signatureName = signatureName;
        this.onchainInception = onchainInception;
        this.dnsInception = dnsInception;
    }
}
//# sourceMappingURL=dns.js.map