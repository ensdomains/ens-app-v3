import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    dark: {
        true: string;
        false: string;
    };
    shadow: {
        true: {};
        false: {};
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
