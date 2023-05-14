import * as React from 'react';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type HelperType = 'info' | 'warning' | 'error';
type Alignment = 'horizontal' | 'vertical';
export type Props = NativeDivProps & {
    type?: HelperType;
    alignment?: Alignment;
    children: React.ReactNode;
};
export declare const Helper: {
    ({ type, alignment, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
