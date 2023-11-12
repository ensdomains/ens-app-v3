import * as React from 'react';
import { WithColorStyle } from './utils/withColorStyle';
import { BoxProps } from '../Box/Box';
export type Props = {
    /** Element type of container */
    as?: 'div' | 'span';
    /** If true, changes colors on hover */
    hover?: boolean;
    /** Size of element */
    size?: 'small' | 'medium';
} & Omit<BoxProps, 'size'> & WithColorStyle;
export declare const Tag: {
    ({ as, children, hover, size, colorStyle, ...props }: Props): React.JSX.Element;
    displayName: string;
};
