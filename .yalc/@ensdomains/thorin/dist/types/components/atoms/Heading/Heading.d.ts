import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Props = {
    /** CSS property of textAlign */
    align?: React.CSSProperties['textAlign'];
    /** JSX element to render. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'legend';
    children?: React.ReactNode;
    color?: Colors;
    /** The id attribute of element */
    id?: string;
    /** CSS property of text-transform */
    transform?: React.CSSProperties['textTransform'];
    /**  */
    responsive?: boolean;
    level?: '1' | '2';
};
export declare const Heading: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
