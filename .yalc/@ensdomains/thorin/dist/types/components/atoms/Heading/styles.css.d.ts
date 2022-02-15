import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    level: {
        '1': string;
        '2': string;
    };
    responsive: {
        true: {};
        false: {};
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
