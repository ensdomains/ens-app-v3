import * as React from 'react';
export declare type Props = {
    title?: string;
    variant?: 'mobile' | 'desktop';
} & NativeDivProps;
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Card: {
    ({ title, variant, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
