import * as React from 'react';
declare type TitleProps = {
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
};
declare type BaseProps = {
    variant?: 'closable' | 'actionable' | 'blank';
    children: React.ReactNode;
    onDismiss?: () => void;
    open: boolean;
};
declare type ClosableProps = {
    variant: 'closable';
} & TitleProps;
declare type ActionableProps = {
    variant: 'actionable';
    trailing?: React.ReactNode;
    leading?: React.ReactNode;
    center?: boolean;
} & TitleProps;
declare type BlankProps = {
    variant: 'blank';
};
declare type Props = BaseProps & (ClosableProps | ActionableProps | BlankProps);
export declare const Dialog: {
    ({ children, onDismiss, open, variant, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
