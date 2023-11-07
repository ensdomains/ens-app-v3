import type { PrimaryColor } from '../../../tokens/color3';
import * as React from 'react';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const CountdownCircle: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    color?: PrimaryColor | undefined;
    startTimestamp?: number | undefined;
    countdownSeconds: number;
    disabled?: boolean | undefined;
    callback?: (() => void) | undefined;
    size?: "large" | "small" | undefined;
} & Omit<NativeDivProps, "color" | "children"> & React.RefAttributes<HTMLDivElement>>;
export {};
