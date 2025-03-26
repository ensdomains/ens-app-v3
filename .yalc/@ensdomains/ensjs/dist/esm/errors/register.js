import { BaseError } from './base.js';
import { EMPTY_ADDRESS } from '../utils/consts.js';
export class LegacyRegistrationInvalidConfigError extends BaseError {
    constructor({ resolverAddress, address, }) {
        super(`Resolver address is required when setting an address`, {
            metaMessages: [
                `- resolverAddress: ${resolverAddress || EMPTY_ADDRESS}`,
                `- addr: ${address || EMPTY_ADDRESS}`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'LegacyRegistrationInvalidConfigError'
        });
    }
}
//# sourceMappingURL=register.js.map