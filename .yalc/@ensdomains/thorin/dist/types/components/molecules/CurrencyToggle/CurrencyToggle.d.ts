import * as React from 'react';
type Size = 'extraSmall' | 'small' | 'medium';
export type Props = {
    size?: Size;
    fiat?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export declare const CurrencyToggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
    fiat?: string | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & React.RefAttributes<HTMLInputElement>>;
export {};
