declare const size: {
    medium: string;
    large: string;
    extraLarge: string;
};
export declare type Size = keyof typeof size;
export declare const inputParent: string;
export declare const root: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    size: {
        medium: string;
        large: string;
        extraLarge: string;
    };
    disabled: {
        true: string;
        false: {};
    };
    error: {
        true: string;
    };
    suffix: {
        true: string;
    };
}>;
export declare const prefix: string;
export declare const suffix: string;
export declare const input: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    size: {
        medium: string;
        large: string;
        extraLarge: string;
    };
    disabled: {
        true: string;
        false: {};
    };
    type: {
        number: string;
        text: {};
    };
}>;
export declare const ghost: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    type: {
        number: string;
        text: {};
    };
}>;
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    prefix: {
        true: string;
    };
    suffix: {
        true: string;
    };
}>;
export declare const max: string;
export {};
