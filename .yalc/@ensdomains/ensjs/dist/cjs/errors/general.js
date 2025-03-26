"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidContractTypeError = exports.UnsupportedNameTypeError = exports.RequiredParameterNotSpecifiedError = exports.AdditionalParameterSpecifiedError = void 0;
const base_js_1 = require("./base.js");
class AdditionalParameterSpecifiedError extends base_js_1.BaseError {
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
exports.AdditionalParameterSpecifiedError = AdditionalParameterSpecifiedError;
class RequiredParameterNotSpecifiedError extends base_js_1.BaseError {
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
exports.RequiredParameterNotSpecifiedError = RequiredParameterNotSpecifiedError;
class UnsupportedNameTypeError extends base_js_1.BaseError {
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
exports.UnsupportedNameTypeError = UnsupportedNameTypeError;
class InvalidContractTypeError extends base_js_1.BaseError {
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
exports.InvalidContractTypeError = InvalidContractTypeError;
//# sourceMappingURL=general.js.map