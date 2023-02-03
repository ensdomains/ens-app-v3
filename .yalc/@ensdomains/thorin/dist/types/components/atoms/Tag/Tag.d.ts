import * as React from 'react';
import { WithColorStyle } from '../../../types/withColorOrColorStyle';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export type Props = {
    /** Element type of container */
    as?: 'div' | 'span';
    /** If true, changes colors on hover */
    hover?: boolean;
    /** Size of element */
    size?: 'small' | 'medium';
} & NativeDivProps & WithColorStyle;
export declare const Tag: {
    ({ as, children, hover, size, colorStyle, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
