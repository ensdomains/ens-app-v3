import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const CountdownCircle: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    countdownAmount: number;
    color?: any;
    disabled?: boolean | undefined;
    callback?: (() => void) | undefined;
    size?: "small" | "large" | undefined;
} & Omit<NativeDivProps, "color" | "children"> & React.RefAttributes<HTMLDivElement>>;
export {};
