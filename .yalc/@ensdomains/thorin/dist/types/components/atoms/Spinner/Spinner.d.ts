import * as React from 'react';
import { BoxProps } from '../Box';
export declare const Spinner: React.ForwardRefExoticComponent<{
    accessibilityLabel?: string | undefined;
    color?: BoxProps['color'];
} & import("@vanilla-extract/recipes/dist/declarations/src/types").VariantSelection<{
    size: {
        small: string;
        large: string;
    };
}> & React.RefAttributes<HTMLElement>>;
