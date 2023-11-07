import type { RuntimeFn, RecipeVariants } from '@vanilla-extract/recipes';
export declare const statusDot: RuntimeFn<{
    show: {
        true: {
            selectors: {
                '&:after': {
                    content: "\"\"";
                    position: "absolute";
                    width: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    height: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    opacity: number;
                    borderWidth: "$2x";
                    borderStyle: "solid";
                    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    transform: "scale(0.3)";
                    transition: "all 0.3s ease-out";
                    boxSizing: "border-box";
                    borderRadius: "50%";
                    top: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    right: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
                '&:focus-within:after': {
                    opacity: number;
                    transform: "scale(1)";
                };
            };
        };
    };
    validated: {
        true: {
            selectors: {
                '&:after': {
                    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    opacity: number;
                    transform: "scale(1)";
                };
                '&:focus-within:after': {
                    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    opacity: number;
                    transform: "scale(1)";
                };
            };
        };
    };
    error: {
        true: {
            selectors: {
                '&:after': {
                    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    opacity: number;
                    transform: "scale(1)";
                };
                '&:focus-within:after': {
                    backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    opacity: number;
                    transform: "scale(1)";
                };
            };
        };
    };
}>;
export type StatusDot = RecipeVariants<typeof statusDot>;
