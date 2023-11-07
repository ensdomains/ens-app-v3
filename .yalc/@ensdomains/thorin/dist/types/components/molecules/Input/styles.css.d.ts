import type { RuntimeFn } from '@vanilla-extract/recipes';
export declare const label: string;
export declare const icon: string;
export declare const input: RuntimeFn<{
    size: {
        small: {
            selectors: {
                '&::placeholder': {
                    fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
        medium: {
            selectors: {
                '&::placeholder': {
                    fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
        large: {
            selectors: {
                '&::placeholder': {
                    fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
        extraLarge: {
            selectors: {
                '&::placeholder': {
                    fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
    };
    showAction: {
        true: {};
    };
}>;
