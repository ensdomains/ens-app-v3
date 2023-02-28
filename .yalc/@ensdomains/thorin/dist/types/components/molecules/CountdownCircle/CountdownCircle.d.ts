import * as React from 'react';
import { Colors } from '../../../tokens';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const CountdownCircle: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    color?: Colors | undefined;
    startTimestamp?: number | undefined;
    countdownSeconds: number;
    disabled?: boolean | undefined;
    callback?: (() => void) | undefined;
    size?: "small" | "large" | undefined;
} & Omit<NativeDivProps, "children" | "color"> & React.RefAttributes<HTMLDivElement>>;
export {};
