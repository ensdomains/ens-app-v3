declare const size: {
    small: string;
    medium: string;
};
export declare type Size = keyof typeof size;
export declare const chevron: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    open: {
        true: string;
    };
}>;
export declare const innerMenuButton: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    size: {
        small: string;
        medium: string;
    };
    open: {
        true: string;
        false: string;
    };
}>;
export {};
