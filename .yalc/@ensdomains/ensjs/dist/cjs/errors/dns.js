"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsNewerRecordTypeAvailableError = exports.DnsInvalidAddressChecksumError = exports.DnsInvalidTxtRecordError = exports.DnsNoTxtRecordError = exports.DnsDnssecWildcardExpansionError = exports.DnsDnssecVerificationFailedError = exports.DnsResponseStatusError = void 0;
const base_js_1 = require("./base.js");
class DnsResponseStatusError extends base_js_1.BaseError {
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
exports.DnsResponseStatusError = DnsResponseStatusError;
class DnsDnssecVerificationFailedError extends base_js_1.BaseError {
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
exports.DnsDnssecVerificationFailedError = DnsDnssecVerificationFailedError;
class DnsDnssecWildcardExpansionError extends base_js_1.BaseError {
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
exports.DnsDnssecWildcardExpansionError = DnsDnssecWildcardExpansionError;
class DnsNoTxtRecordError extends base_js_1.BaseError {
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
exports.DnsNoTxtRecordError = DnsNoTxtRecordError;
class DnsInvalidTxtRecordError extends base_js_1.BaseError {
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
exports.DnsInvalidTxtRecordError = DnsInvalidTxtRecordError;
class DnsInvalidAddressChecksumError extends base_js_1.BaseError {
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
exports.DnsInvalidAddressChecksumError = DnsInvalidAddressChecksumError;
class DnsNewerRecordTypeAvailableError extends base_js_1.BaseError {
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
exports.DnsNewerRecordTypeAvailableError = DnsNewerRecordTypeAvailableError;
//# sourceMappingURL=dns.js.map