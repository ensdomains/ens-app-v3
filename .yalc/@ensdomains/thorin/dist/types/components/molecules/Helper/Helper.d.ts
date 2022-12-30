import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type HelperType = 'info' | 'warning' | 'error';
declare type Alignment = 'horizontal' | 'vertical';
export declare type Props = NativeDivProps & {
    type?: HelperType;
    alignment?: Alignment;
    children: React.ReactNode;
};
export declare const Helper: {
    ({ type, alignment, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
