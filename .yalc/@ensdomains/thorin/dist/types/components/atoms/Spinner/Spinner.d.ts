import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Size = 'small' | 'medium' | 'large';
export declare const Spinner: React.ForwardRefExoticComponent<{
    /** Hidden text used for accessibilty. */
    accessibilityLabel?: string | undefined;
    /** A tokens 'mode' color value */
    color?: any;
    size?: Size | undefined;
} & Omit<NativeDivProps, "children" | "color"> & React.RefAttributes<HTMLElement>>;
export {};
