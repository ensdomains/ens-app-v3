export declare const validateName: (name: string) => string;
export declare const validateTLD: (name: string) => string;
declare type InputType = {
    type: 'name' | 'label' | 'address' | 'unknown';
    info?: 'short' | 'supported' | 'unsupported';
};
export declare const parseInputType: (input: string) => InputType;
export {};
