import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    size: {
        small: string;
        large: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
