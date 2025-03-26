import { type Label } from './normalise.js';
export declare const validateName: (name: string) => string;
export type ParsedInputResult = {
    type: 'name' | 'label';
    normalised: string | undefined;
    isValid: boolean;
    isShort: boolean;
    is2LD: boolean;
    isETH: boolean;
    labelDataArray: Label[];
};
export declare const parseInput: (input: string) => ParsedInputResult;
export declare const checkIsDotEth: (labels: string[]) => boolean;
//# sourceMappingURL=validation.d.ts.map