import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    noBorder: {
        true: {};
        false: string;
    };
    shape: {
        circle: string;
        square: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
