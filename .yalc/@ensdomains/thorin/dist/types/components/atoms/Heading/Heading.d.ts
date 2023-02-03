import * as React from 'react';
import { WithColor } from '../../../types/withColorOrColorStyle';
type NativeDivAttributes = React.HTMLAttributes<HTMLDivElement>;
export declare const Heading: React.ForwardRefExoticComponent<{
    /** CSS property of textAlign */
    align?: React.CSSProperties['textAlign'];
    /** JSX element to render. */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "legend" | undefined;
    children?: NativeDivAttributes['children'];
    /** The id attribute of element */
    id?: NativeDivAttributes['id'];
    /** CSS property of text-transform */
    transform?: React.CSSProperties['textTransform'];
    /**  */
    responsive?: boolean | undefined;
    level?: "1" | "2" | undefined;
} & WithColor & Omit<NativeDivAttributes, "color"> & React.RefAttributes<HTMLDivElement>>;
export {};
