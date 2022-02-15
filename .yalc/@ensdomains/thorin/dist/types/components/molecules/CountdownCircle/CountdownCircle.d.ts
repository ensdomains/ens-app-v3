import * as React from 'react';
import { BoxProps } from '../..';
export declare const CountdownCircle: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    countdownAmount: number;
    color?: BoxProps['color'];
    disabled?: boolean | undefined;
    callback?: (() => void) | undefined;
} & import("@vanilla-extract/recipes/dist/declarations/src/types").VariantSelection<{
    size: {
        small: string;
        large: string;
    };
    disabled: {
        true: string;
    };
}> & React.RefAttributes<HTMLElement>>;
