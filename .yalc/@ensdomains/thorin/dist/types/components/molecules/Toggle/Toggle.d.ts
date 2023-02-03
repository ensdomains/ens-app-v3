import * as React from 'react';
type Size = 'small' | 'medium' | 'large';
export type Props = {
    size?: Size;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;
export declare const Toggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & React.RefAttributes<HTMLInputElement>>;
export {};
