import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    size: {
        small: string;
        medium: string;
        large: string;
    };
    hasChevron: {
        true: string;
    };
    open: {
        true: string;
        false: string;
    };
}>;
export declare const chevron: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    open: {
        true: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
