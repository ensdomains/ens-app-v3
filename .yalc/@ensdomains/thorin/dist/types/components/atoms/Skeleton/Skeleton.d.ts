import * as React from 'react';
import { BoxProps } from '../Box';
declare type Props = {
    as?: 'div' | 'span';
    backgroundColor?: BoxProps['backgroundColor'];
    radius?: BoxProps['borderRadius'];
    height?: BoxProps['height'];
    loading?: boolean;
    maxWidth?: BoxProps['maxWidth'];
    width?: BoxProps['width'];
};
export declare const Skeleton: ({ as, backgroundColor, radius, children, height, loading, maxWidth, width, }: React.PropsWithChildren<Props>) => JSX.Element;
export {};
