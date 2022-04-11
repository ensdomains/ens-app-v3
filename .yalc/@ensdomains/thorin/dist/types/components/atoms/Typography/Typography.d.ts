import * as React from 'react';
import { Colors } from '@/src/tokens';
declare type Variants = 'small' | 'large' | 'extraLarge' | 'label' | 'labelHeading';
declare type Weights = 'bold' | 'semiBold' | 'medium' | 'normal' | 'light';
declare type Fonts = 'sans' | 'mono';
declare type Props = {
    as?: 'code' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'p' | 'span' | 'i';
    children?: React.ReactNode;
    ellipsis?: boolean;
    variant?: Variants;
    className?: string;
    weight?: Weights;
    font?: Fonts;
    color?: Colors;
    size?: 'small' | 'base';
};
export declare const Typography: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
