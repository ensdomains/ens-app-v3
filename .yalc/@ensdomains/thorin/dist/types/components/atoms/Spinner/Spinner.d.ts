import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Props = {
    /** Hidden text used for accessibilty. */
    accessibilityLabel?: string;
    /** A tokens 'mode' color value */
    color?: Colors;
    size?: 'small' | 'large';
};
export declare const Spinner: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
