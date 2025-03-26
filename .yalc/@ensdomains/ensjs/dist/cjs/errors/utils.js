"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolverAddressRequiredError = exports.UnknownContentTypeError = exports.InvalidContentHashError = exports.CampaignReferenceTooLargeError = exports.WrappedLabelTooLargeError = exports.RootNameIncludesOtherLabelsError = exports.NameWithEmptyLabelsError = exports.InvalidLabelhashError = exports.InvalidEncodedLabelError = exports.FusesInvalidUnnamedFuseError = exports.FusesFuseNotAllowedError = exports.FusesInvalidNamedFuseError = exports.FusesValueRequiredError = exports.FusesInvalidFuseObjectError = exports.FusesRestrictionNotAllowedError = exports.FusesOutOfRangeError = void 0;
const base_js_1 = require("./base.js");
class FusesOutOfRangeError extends base_js_1.BaseError {
    constructor({ fuses, minimum = 0n, maximum = 2n ** 32n, details, }) {
        super('Fuse value out of range', {
            metaMessages: [
                `- Fuse value: ${fuses}`,
                `- Allowed range: ${minimum}-${maximum}`,
            ],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesOutOfRangeError'
        });
    }
}
exports.FusesOutOfRangeError = FusesOutOfRangeError;
class FusesRestrictionNotAllowedError extends base_js_1.BaseError {
    constructor({ fuses, details, }) {
        super('Restriction not allowed', {
            metaMessages: [`- Fuse value: ${fuses}`],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesRestrictionNotAllowed'
        });
    }
}
exports.FusesRestrictionNotAllowedError = FusesRestrictionNotAllowedError;
class FusesInvalidFuseObjectError extends base_js_1.BaseError {
    constructor({ fuses, details }) {
        super('Invalid fuse value', {
            metaMessages: [`- Fuse value: ${fuses}`],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesInvalidFuseObjectError'
        });
    }
}
exports.FusesInvalidFuseObjectError = FusesInvalidFuseObjectError;
class FusesValueRequiredError extends base_js_1.BaseError {
    constructor() {
        super('Must specify at least one fuse');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesValueRequiredError'
        });
    }
}
exports.FusesValueRequiredError = FusesValueRequiredError;
class FusesInvalidNamedFuseError extends base_js_1.BaseError {
    constructor({ fuse }) {
        super(`${fuse} is not a valid named fuse`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesInvalidNamedFuseError'
        });
    }
}
exports.FusesInvalidNamedFuseError = FusesInvalidNamedFuseError;
class FusesFuseNotAllowedError extends base_js_1.BaseError {
    constructor({ fuse }) {
        super(`${fuse} is not allowed for this operation`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesFuseNotAllowedError'
        });
    }
}
exports.FusesFuseNotAllowedError = FusesFuseNotAllowedError;
class FusesInvalidUnnamedFuseError extends base_js_1.BaseError {
    constructor({ fuse }) {
        super(`${fuse} is not a valid unnamed fuse`, {
            metaMessages: [
                `- If you are trying to set a named fuse, use the named property`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FusesInvalidUnnamedFuseError'
        });
    }
}
exports.FusesInvalidUnnamedFuseError = FusesInvalidUnnamedFuseError;
class InvalidEncodedLabelError extends base_js_1.BaseError {
    constructor({ label, details }) {
        super('Invalid encoded label', {
            metaMessages: [`- Supplied label: ${label}`],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidEncodedLabelError'
        });
    }
}
exports.InvalidEncodedLabelError = InvalidEncodedLabelError;
class InvalidLabelhashError extends base_js_1.BaseError {
    constructor({ labelhash, details }) {
        super('Invalid labelhash', {
            metaMessages: [`- Supplied labelhash: ${labelhash}`],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidLabelhashError'
        });
    }
}
exports.InvalidLabelhashError = InvalidLabelhashError;
class NameWithEmptyLabelsError extends base_js_1.BaseError {
    constructor({ name, details }) {
        super('Name cannot have empty labels', {
            metaMessages: [`- Supplied name: ${name}`],
            details,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'NameWithEmptyLabelsError'
        });
    }
}
exports.NameWithEmptyLabelsError = NameWithEmptyLabelsError;
class RootNameIncludesOtherLabelsError extends base_js_1.BaseError {
    constructor({ name }) {
        super('Root name cannot have other labels', {
            metaMessages: [`- Supplied name: ${name}`],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'RootNameIncludesOtherLabelsError'
        });
    }
}
exports.RootNameIncludesOtherLabelsError = RootNameIncludesOtherLabelsError;
class WrappedLabelTooLargeError extends base_js_1.BaseError {
    constructor({ label, byteLength }) {
        super('Supplied label was too long', {
            metaMessages: [
                `- Supplied label: ${label}`,
                `- Max byte length: 255`,
                `- Actual byte length: ${byteLength}`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'WrappedLabelTooLargeError'
        });
    }
}
exports.WrappedLabelTooLargeError = WrappedLabelTooLargeError;
class CampaignReferenceTooLargeError extends base_js_1.BaseError {
    constructor({ campaign }) {
        super(`Campaign reference ${campaign} is too large`, {
            metaMessages: [`- Max campaign reference: ${0xffffffff}`],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CampaignReferenceTooLargeError'
        });
    }
}
exports.CampaignReferenceTooLargeError = CampaignReferenceTooLargeError;
class InvalidContentHashError extends base_js_1.BaseError {
    constructor() {
        super('Invalid content hash');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidContentHashError'
        });
    }
}
exports.InvalidContentHashError = InvalidContentHashError;
class UnknownContentTypeError extends base_js_1.BaseError {
    constructor({ contentType }) {
        super(`Unknown content type: ${contentType}`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'UnknownContentTypeError'
        });
    }
}
exports.UnknownContentTypeError = UnknownContentTypeError;
class ResolverAddressRequiredError extends base_js_1.BaseError {
    constructor({ data }) {
        super('Resolver address is required when data is supplied', {
            metaMessages: [
                'Supplied data:',
                ...Object.entries(data).map(([k, v]) => `- ${k}: ${v}`),
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ResolverAddressRequiredError'
        });
    }
}
exports.ResolverAddressRequiredError = ResolverAddressRequiredError;
//# sourceMappingURL=utils.js.map