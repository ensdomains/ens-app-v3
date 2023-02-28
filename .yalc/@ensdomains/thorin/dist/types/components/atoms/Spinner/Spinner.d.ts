import * as React from 'react';
import { Colors } from '../../../tokens';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Size = 'small' | 'medium' | 'large';
export declare const Spinner: React.ForwardRefExoticComponent<{
    /** Hidden text used for accessibilty. */
    accessibilityLabel?: string | undefined;
    /** A tokens 'mode' color value */
    color?: Colors | undefined;
    size?: Size | undefined;
} & Omit<NativeDivProps, "children" | "color"> & React.RefAttributes<HTMLElement>>;
export {};
