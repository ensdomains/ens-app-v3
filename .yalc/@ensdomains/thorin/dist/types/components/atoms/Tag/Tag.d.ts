import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare type Props = {
    /** Element type of container */
    as?: 'div' | 'span';
    /** Text of optional label element */
    label?: string;
    /** If true, changes colors on hover */
    hover?: boolean;
    /** Size of element */
    size?: 'small' | 'medium';
    /** Color style of tag */
    tone?: 'accent' | 'blue' | 'green' | 'red' | 'secondary';
} & NativeDivProps;
export declare const Tag: {
    ({ as, children, hover, label, size, tone, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
