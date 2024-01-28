import { getVersion } from './error-utils.js';
export class BaseError extends Error {
    constructor(shortMesage, args = {}) {
        super();
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'EnsJsError'
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getVersion()
        });
        const details = args.cause instanceof BaseError
            ? args.cause.details
            : args.cause?.message ?? args.details;
        this.message = [
            shortMesage || 'An error occurred',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(details ? [`Details: ${details}`, ''] : []),
            `Version: ${this.version}`,
        ].join('\n');
        if (args.cause)
            this.cause = args.cause;
        this.details = details;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMesage;
    }
}
//# sourceMappingURL=base.js.map