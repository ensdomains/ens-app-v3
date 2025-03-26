"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyRegistrationInvalidConfigError = void 0;
const base_js_1 = require("./base.js");
const consts_js_1 = require("../utils/consts.js");
class LegacyRegistrationInvalidConfigError extends base_js_1.BaseError {
    constructor({ resolverAddress, address, }) {
        super(`Resolver address is required when setting an address`, {
            metaMessages: [
                `- resolverAddress: ${resolverAddress || consts_js_1.EMPTY_ADDRESS}`,
                `- addr: ${address || consts_js_1.EMPTY_ADDRESS}`,
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
exports.LegacyRegistrationInvalidConfigError = LegacyRegistrationInvalidConfigError;
//# sourceMappingURL=register.js.map