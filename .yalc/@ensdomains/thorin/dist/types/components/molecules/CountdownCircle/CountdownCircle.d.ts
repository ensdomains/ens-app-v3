import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Props = {
    accessibilityLabel?: string;
    countdownAmount: number;
    color?: Colors;
    disabled?: boolean;
    callback?: () => void;
    size?: 'small' | 'large';
};
export declare const CountdownCircle: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
