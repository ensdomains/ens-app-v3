import * as React from 'react';
import { Props as CardProps } from '../../atoms/Card/Card';
declare type Props = {
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    trailing?: React.ReactNode;
    leading?: React.ReactNode;
    center?: boolean;
    children: React.ReactNode;
    backdropSurface?: React.ElementType;
    onDismiss?: () => void;
    open: boolean;
} & CardProps;
export declare const Dialog: ({ title, subtitle, trailing, leading, center, children, ...cardProps }: Props) => JSX.Element;
export {};
