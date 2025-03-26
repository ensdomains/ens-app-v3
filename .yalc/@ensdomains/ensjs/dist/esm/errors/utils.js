import { BaseError } from './base.js';
export class FusesOutOfRangeError extends BaseError {
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
export class FusesRestrictionNotAllowedError extends BaseError {
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
export class FusesInvalidFuseObjectError extends BaseError {
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
export class FusesValueRequiredError extends BaseError {
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
export class FusesInvalidNamedFuseError extends BaseError {
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
export class FusesFuseNotAllowedError extends BaseError {
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
export class FusesInvalidUnnamedFuseError extends BaseError {
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
export class InvalidEncodedLabelError extends BaseError {
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
export class InvalidLabelhashError extends BaseError {
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
export class NameWithEmptyLabelsError extends BaseError {
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
export class RootNameIncludesOtherLabelsError extends BaseError {
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
export class WrappedLabelTooLargeError extends BaseError {
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
export class CampaignReferenceTooLargeError extends BaseError {
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
export class InvalidContentHashError extends BaseError {
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
export class UnknownContentTypeError extends BaseError {
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
export class ResolverAddressRequiredError extends BaseError {
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
//# sourceMappingURL=utils.js.map