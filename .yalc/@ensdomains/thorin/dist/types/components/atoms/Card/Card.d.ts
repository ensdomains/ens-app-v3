import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare type Props = {
    /** Adds shadow when theme is in light mode.  */
    shadow?: boolean;
} & NativeDivProps;
export declare const Card: {
    ({ children, shadow, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
