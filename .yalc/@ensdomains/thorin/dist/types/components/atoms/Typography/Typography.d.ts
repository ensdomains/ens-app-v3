import * as React from 'react';
declare type Variants = 'small' | 'large' | 'extraLarge' | 'label' | 'labelHeading';
declare type Weights = 'bold' | 'semiBold' | 'medium' | 'normal' | 'light';
declare type Fonts = 'sans' | 'mono';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Typography: React.ForwardRefExoticComponent<{
    /** element type of container */
    as?: "code" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "i" | "label" | "p" | "span" | undefined;
    /** If true, will truncate text with an elipsis on overflow. If false, text will break on the next word. */
    ellipsis?: boolean | undefined;
    /** Font size and */
    variant?: Variants | undefined;
    /** The classname attribute of contianer. */
    className?: NativeDivProps['className'];
    /** The tokens.fontWeight value */
    weight?: Weights | undefined;
    /** The  */
    font?: Fonts | undefined;
    color?: any;
    size?: "base" | "small" | undefined;
} & Omit<NativeDivProps, "color"> & React.RefAttributes<HTMLElement>>;
export {};
