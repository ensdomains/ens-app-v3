import * as React from 'react';
import { Colors } from '../../../tokens';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const CountdownCircle: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    color?: Colors | undefined;
    startTimestamp?: number | undefined;
    countdownSeconds: number;
    disabled?: boolean | undefined;
    callback?: (() => void) | undefined;
    size?: "small" | "large" | undefined;
} & Omit<NativeDivProps, "color" | "children"> & React.RefAttributes<HTMLDivElement>>;
export {};
