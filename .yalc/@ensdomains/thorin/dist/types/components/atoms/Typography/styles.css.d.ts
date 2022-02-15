import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    variant: {
        extraLarge: string;
        large: string;
        base: string;
        small: string;
        label: string;
        labelHeading: string;
    };
    ellipsis: {
        true: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
