import * as React from 'react';
import { Props as CardProps } from '../../atoms/Card/Card';
declare type Props = {
    children: React.ReactNode;
    backdropSurface?: React.ElementType;
    onDismiss?: () => void;
    open: boolean;
} & CardProps;
export declare const Modal: ({ children, backdropSurface, onDismiss, open, ...cardProps }: Props) => JSX.Element;
export {};
