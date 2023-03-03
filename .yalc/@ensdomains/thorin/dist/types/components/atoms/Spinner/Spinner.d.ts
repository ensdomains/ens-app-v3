import * as React from 'react';
import { Colors } from '../../../tokens';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Size = 'small' | 'medium' | 'large';
export declare const Spinner: React.ForwardRefExoticComponent<{
    /** Hidden text used for accessibilty. */
    accessibilityLabel?: string | undefined;
    /** A tokens 'mode' color value */
    color?: Colors | undefined;
    size?: Size | undefined;
} & Omit<NativeDivProps, "color" | "children"> & React.RefAttributes<HTMLElement>>;
export {};
