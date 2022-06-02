import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Variants = 'small' | 'large' | 'extraLarge' | 'label' | 'labelHeading';
declare type Weights = 'bold' | 'semiBold' | 'medium' | 'normal' | 'light';
declare type Fonts = 'sans' | 'mono';
declare type Props = {
    /** element type of container */
    as?: 'code' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'p' | 'span' | 'i';
    children?: React.ReactNode;
    /** If true, will truncate text with an elipsis on overflow. If false, text will break on the next word. */
    ellipsis?: boolean;
    /** Font size and */
    variant?: Variants;
    /** The classname attribute of contianer. */
    className?: string;
    /** The tokens.fontWeight value */
    weight?: Weights;
    /** The  */
    font?: Fonts;
    color?: Colors;
    size?: 'small' | 'base';
};
export declare const Typography: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
