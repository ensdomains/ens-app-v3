import * as React from 'react';
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
};
export declare const Tag: {
    ({ as, children, hover, label, size, tone, }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
