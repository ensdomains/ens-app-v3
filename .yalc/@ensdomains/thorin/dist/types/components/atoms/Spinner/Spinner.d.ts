import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Spinner: React.ForwardRefExoticComponent<{
    /** Hidden text used for accessibilty. */
    accessibilityLabel?: string | undefined;
    /** A tokens 'mode' color value */
    color?: any;
    size?: "small" | "large" | undefined;
} & Omit<NativeDivProps, "color" | "children"> & React.RefAttributes<HTMLElement>>;
export {};
