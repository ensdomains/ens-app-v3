import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Props = {
    accessibilityLabel?: string;
    color?: Colors;
    size?: 'small' | 'large';
};
export declare const Spinner: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
