import type { Address } from 'viem';
import { BaseError } from './base.js';
export declare class LegacyRegistrationInvalidConfigError extends BaseError {
    name: string;
    constructor({ resolverAddress, address, }: {
        resolverAddress?: Address;
        address?: Address;
    });
}
//# sourceMappingURL=register.d.ts.map