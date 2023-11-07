import * as React from 'react';
import { BoxProps } from '../Box/Box';
export type Props = {
    title?: string;
} & BoxProps;
export declare const Card: {
    ({ title, children, ...props }: Props): React.JSX.Element;
    displayName: string;
    Divider: (props: BoxProps) => React.JSX.Element;
};
