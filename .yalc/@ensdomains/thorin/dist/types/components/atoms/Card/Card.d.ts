import * as React from 'react';
import { BoxProps } from '../Box';
export declare type Props = {
    as?: BoxProps['as'];
    shadow?: boolean;
    padding?: BoxProps['padding'];
    width?: BoxProps['width'];
};
export declare const Card: ({ as, children, padding, shadow, width, }: React.PropsWithChildren<Props>) => JSX.Element;
