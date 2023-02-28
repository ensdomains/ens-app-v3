import * as React from 'react';
declare type Size = 'small' | 'medium' | 'large';
export declare type Props = {
    size?: Size;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;
export declare const Toggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & React.RefAttributes<HTMLInputElement>>;
export {};
