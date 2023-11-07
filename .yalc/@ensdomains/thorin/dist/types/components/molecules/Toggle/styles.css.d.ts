import type { RuntimeFn } from '@vanilla-extract/recipes';
export declare const toggle: RuntimeFn<{
    size: {
        small: {
            selectors: {
                '&::after': {
                    width: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    height: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
                '&:not(:checked)::after': {
                    transform: string;
                };
                '&:checked::after': {
                    transform: string;
                };
            };
        };
        medium: {
            selectors: {
                '&::after': {
                    width: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    height: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
                '&:not(:checked)::after': {
                    transform: string;
                };
                '&:checked::after': {
                    transform: string;
                };
            };
        };
        large: {
            selectors: {
                '&::after': {
                    width: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                    height: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
                '&:not(:checked)::after': {
                    transform: string;
                };
                '&:checked::after': {
                    transform: string;
                };
            };
        };
    };
}>;
