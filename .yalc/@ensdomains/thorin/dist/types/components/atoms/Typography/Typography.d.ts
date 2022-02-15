import * as React from 'react';
import { BoxProps } from '../Box';
export declare const Typography: React.ForwardRefExoticComponent<{
    align?: BoxProps['textAlign'];
    as?: "label" | "div" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "i" | "p" | "span" | undefined;
    children?: React.ReactNode;
    color?: BoxProps['color'];
    font?: BoxProps['fontFamily'];
    letterSpacing?: BoxProps['letterSpacing'];
    lineHeight?: BoxProps['lineHeight'];
    size?: BoxProps['fontSize'];
    transform?: BoxProps['textTransform'];
    weight?: BoxProps['fontWeight'];
    whiteSpace?: BoxProps['whiteSpace'];
} & import("@vanilla-extract/recipes/dist/declarations/src/types").VariantSelection<{
    variant: {
        extraLarge: string;
        large: string;
        base: string;
        small: string;
        label: string;
        labelHeading: string;
    };
    ellipsis: {
        true: string;
    };
}> & React.RefAttributes<HTMLElement>>;
