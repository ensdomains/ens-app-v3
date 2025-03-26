import { BaseError } from './base.js';
export declare class FusesOutOfRangeError extends BaseError {
    name: string;
    constructor({ fuses, minimum, maximum, details, }: {
        fuses: bigint;
        minimum?: bigint;
        maximum?: bigint;
        details?: string;
    });
}
export declare class FusesRestrictionNotAllowedError extends BaseError {
    name: string;
    constructor({ fuses, details, }: {
        fuses: object | bigint;
        details?: string;
    });
}
export declare class FusesInvalidFuseObjectError extends BaseError {
    name: string;
    constructor({ fuses, details }: {
        fuses: object;
        details?: string;
    });
}
export declare class FusesValueRequiredError extends BaseError {
    name: string;
    constructor();
}
export declare class FusesInvalidNamedFuseError extends BaseError {
    name: string;
    constructor({ fuse }: {
        fuse: string;
    });
}
export declare class FusesFuseNotAllowedError extends BaseError {
    name: string;
    constructor({ fuse }: {
        fuse: string | bigint;
    });
}
export declare class FusesInvalidUnnamedFuseError extends BaseError {
    name: string;
    constructor({ fuse }: {
        fuse: any;
    });
}
export declare class InvalidEncodedLabelError extends BaseError {
    name: string;
    constructor({ label, details }: {
        label: string;
        details?: string;
    });
}
export declare class InvalidLabelhashError extends BaseError {
    name: string;
    constructor({ labelhash, details }: {
        labelhash: string;
        details?: string;
    });
}
export declare class NameWithEmptyLabelsError extends BaseError {
    name: string;
    constructor({ name, details }: {
        name: string;
        details?: string;
    });
}
export declare class RootNameIncludesOtherLabelsError extends BaseError {
    name: string;
    constructor({ name }: {
        name: string;
    });
}
export declare class WrappedLabelTooLargeError extends BaseError {
    name: string;
    constructor({ label, byteLength }: {
        label: string;
        byteLength: number;
    });
}
export declare class CampaignReferenceTooLargeError extends BaseError {
    name: string;
    constructor({ campaign }: {
        campaign: number;
    });
}
export declare class InvalidContentHashError extends BaseError {
    name: string;
    constructor();
}
export declare class UnknownContentTypeError extends BaseError {
    name: string;
    constructor({ contentType }: {
        contentType: string;
    });
}
export declare class ResolverAddressRequiredError extends BaseError {
    name: string;
    constructor({ data }: {
        data: object;
    });
}
//# sourceMappingURL=utils.d.ts.map