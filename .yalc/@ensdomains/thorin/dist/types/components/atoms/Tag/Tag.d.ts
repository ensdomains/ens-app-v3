import * as React from 'react';
import { WithColor } from '@/src/types';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare type Props = {
    /** Element type of container */
    as?: 'div' | 'span';
    /** If true, changes colors on hover */
    hover?: boolean;
    /** Size of element */
    size?: 'small' | 'medium';
} & NativeDivProps & WithColor;
export declare const Tag: {
    ({ as, children, hover, size, color, colorScheme, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
