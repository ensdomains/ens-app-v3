import * as React from 'react';
import { WithColor } from '../../../interfaces/withColor';
import { type BoxProps } from '../Box/Box';
import { FontVariant } from './utils/getValueForVariant';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Typography: React.ForwardRefExoticComponent<{
    /** element type of container */
    as?: "p" | "label" | "span" | "code" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "i" | undefined;
    /** If true, will truncate text with an elipsis on overflow. If false, text will break on the next word. */
    ellipsis?: boolean | undefined;
    /** The classname attribute of contianer. */
    className?: NativeDivProps['className'];
    /** The tokens.fontWeight value */
    /** A font value that overrides the existing font property  */
    font?: "mono" | "sans" | undefined;
    /** A weight value that overrides existing weight property */
    weight?: "normal" | "light" | "bold" | "extraBold" | undefined;
    fontVariant?: FontVariant | undefined;
} & Omit<NativeDivProps, "color" | "translate" | "as"> & WithColor & Omit<BoxProps, "color"> & {
    fontVariant?: FontVariant | undefined;
} & React.RefAttributes<HTMLElement>>;
export {};
