import type { RuntimeFn } from '@vanilla-extract/recipes';
export declare const statusBorder: RuntimeFn<{
    readonly: {
        true: {
            cursor: "default";
            selectors: {
                '&:not(:disabled):focus-within': {
                    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
    };
    error: {
        true: {
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            selectors: {
                '&:not(:disabled):focus-within': {
                    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
    };
    disabled: {
        true: {
            cursor: "not-allowed";
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            selectors: {
                '&:not(:disabled):focus-within': {
                    borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
                };
            };
        };
    };
}>;
