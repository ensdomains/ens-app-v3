import { RecipeVariants } from '@vanilla-extract/recipes';
export declare const label: string;
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    hover: {
        true: string;
        false: {};
    };
    size: {
        small: string;
        medium: string;
    };
    tone: {
        accent: string;
        blue: string;
        green: string;
        secondary: string;
        red: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
