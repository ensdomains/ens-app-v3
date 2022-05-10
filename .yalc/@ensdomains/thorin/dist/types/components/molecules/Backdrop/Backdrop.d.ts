import * as React from 'react';
declare type Props = {
    children: React.ReactNode;
    surface?: React.ElementType;
    onDismiss?: () => void;
    open: boolean;
};
export declare const Backdrop: ({ children, surface, onDismiss, open }: Props) => JSX.Element | null;
export {};
