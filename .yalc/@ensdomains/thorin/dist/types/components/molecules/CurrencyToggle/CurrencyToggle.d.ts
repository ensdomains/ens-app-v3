import * as React from 'react';
declare type Size = 'small' | 'medium';
export declare type Props = {
    size?: Size;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export declare const CurrencyToggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & React.RefAttributes<HTMLInputElement>>;
export {};
