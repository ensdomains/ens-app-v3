declare const color: {
    grey: string;
    white: string;
};
export declare type Color = keyof typeof color;
declare const size: {
    small: string;
    medium: string;
    large: string;
};
export declare type Size = keyof typeof size;
declare const variant: {
    regular: string;
    switch: string;
};
export declare type Variant = keyof typeof variant;
export declare const input: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    variant: {
        regular: string;
        switch: string;
    };
    color: {
        grey: string;
        white: string;
    };
    size: {
        small: string;
        medium: string;
        large: string;
    };
    disabled: {
        true: {};
    };
}>;
export {};
