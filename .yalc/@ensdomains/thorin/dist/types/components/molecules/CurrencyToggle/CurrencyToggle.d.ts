import * as React from 'react';
type Size = 'small' | 'medium';
export type Props = {
    size?: Size;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export declare const CurrencyToggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & React.RefAttributes<HTMLInputElement>>;
export {};
