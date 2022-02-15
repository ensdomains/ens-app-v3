import { RecipeVariants } from '@vanilla-extract/recipes';
declare const shape: {
    circle: string;
    square: {};
};
export declare type Shape = keyof typeof shape;
declare const size: {
    extraSmall: string;
    small: string;
    medium: string;
};
export declare type Size = keyof typeof size;
declare const tone: {
    accent: {};
    blue: string;
    green: string;
    red: string;
};
export declare type Tone = keyof typeof tone;
declare const variant: {
    primary: string;
    secondary: string;
    action: string;
    transparent: string;
};
export declare type Variant = keyof typeof variant;
export declare const variants: import("@vanilla-extract/recipes/dist/declarations/src/types").RuntimeFn<{
    disabled: {
        true: string;
        false: {};
    };
    center: {
        true: string;
        false: {};
    };
    pressed: {
        true: string;
        false: {};
    };
    shadowless: {
        true: string;
        false: {};
    };
    shape: {
        circle: string;
        square: {};
    };
    size: {
        extraSmall: string;
        small: string;
        medium: string;
    };
    tone: {
        accent: {};
        blue: string;
        green: string;
        red: string;
    };
    variant: {
        primary: string;
        secondary: string;
        action: string;
        transparent: string;
    };
}>;
export declare type Variants = RecipeVariants<typeof variants>;
export {};
