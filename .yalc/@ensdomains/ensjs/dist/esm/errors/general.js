import { BaseError } from './base.js';
export class AdditionalParameterSpecifiedError extends BaseError {
    constructor({ parameter, allowedParameters, details, }) {
        super(`Additional parameter specified: ${parameter}`, {
            metaMessages: [`- Allowed parameters: ${allowedParameters.join(', ')}`],
            details,
        });
        Object.defineProperty(this, "parameter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "allowedParameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AdditionalParameterSpecifiedError'
        });
        this.parameter = parameter;
        this.allowedParameters = allowedParameters;
    }
}
export class RequiredParameterNotSpecifiedError extends BaseError {
    constructor({ parameter, details }) {
        super(`Required parameter not specified: ${parameter}`, { details });
        Object.defineProperty(this, "parameter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'RequiredParameterNotSpecifiedError'
        });
        this.parameter = parameter;
    }
}
export class UnsupportedNameTypeError extends BaseError {
    constructor({ nameType, supportedNameTypes, details, }) {
        super(`Unsupported name type: ${nameType}`, {
            metaMessages: [
                `- Supported name types: ${supportedNameTypes.join(', ')}`,
            ],
            details,
        });
        Object.defineProperty(this, "nameType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'UnsupportedNameTypeError'
        });
        this.nameType = nameType;
        this.supportedTypes = supportedNameTypes;
    }
}
export class InvalidContractTypeError extends BaseError {
    constructor({ contractType, supportedContractTypes, details, }) {
        super(`Invalid contract type: ${contractType}`, {
            metaMessages: [
                `- Supported contract types: ${supportedContractTypes.join(', ')}`,
            ],
            details,
        });
        Object.defineProperty(this, "contractType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "supportedTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidContractTypeError'
        });
        this.contractType = contractType;
        this.supportedTypes = supportedContractTypes;
    }
}
//# sourceMappingURL=general.js.map