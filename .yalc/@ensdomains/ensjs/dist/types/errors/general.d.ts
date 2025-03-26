import type { NameType } from '../types.js';
import { BaseError } from './base.js';
export declare class AdditionalParameterSpecifiedError extends BaseError {
    parameter: string;
    allowedParameters: string[];
    name: string;
    constructor({ parameter, allowedParameters, details, }: {
        parameter: string;
        allowedParameters: string[];
        details?: string;
    });
}
export declare class RequiredParameterNotSpecifiedError extends BaseError {
    parameter: string;
    name: string;
    constructor({ parameter, details }: {
        parameter: string;
        details?: string;
    });
}
export declare class UnsupportedNameTypeError extends BaseError {
    nameType: NameType;
    supportedTypes: NameType[];
    name: string;
    constructor({ nameType, supportedNameTypes, details, }: {
        nameType: NameType;
        supportedNameTypes: NameType[];
        details?: string;
    });
}
export declare class InvalidContractTypeError extends BaseError {
    contractType: string;
    supportedTypes: string[];
    name: string;
    constructor({ contractType, supportedContractTypes, details, }: {
        contractType: string;
        supportedContractTypes: string[];
        details?: string;
    });
}
//# sourceMappingURL=general.d.ts.map