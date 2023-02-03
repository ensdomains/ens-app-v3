import * as React from 'react';
import { Font, FontWeight } from '../../../tokens/typography';
import { WithTypography } from '../../../types/withTypography';
import { WithColor } from '../../../types/withColorOrColorStyle';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Typography: React.ForwardRefExoticComponent<{
    /** element type of container */
    asProp?: "code" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "i" | "label" | "p" | "span" | undefined;
    /** If true, will truncate text with an elipsis on overflow. If false, text will break on the next word. */
    ellipsis?: boolean | undefined;
    /** The classname attribute of contianer. */
    className?: NativeDivProps['className'];
    /** The tokens.fontWeight value */
    /** A font value that overrides the existing font property  */
    font?: Font | undefined;
    /** A weight value that overrides existing weight property */
    weight?: FontWeight | undefined;
} & Omit<NativeDivProps, "color" | "as"> & WithTypography & WithColor & React.RefAttributes<HTMLElement>>;
export {};
