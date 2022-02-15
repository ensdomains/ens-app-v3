import * as React from 'react';
import { BoxProps } from '../Box';
import * as styles from './styles.css';
export declare type Props = {
    as?: 'img' | React.ComponentType;
    label: string;
    placeholder?: boolean;
    noBorder?: boolean;
    size?: BoxProps['height'];
    src?: string;
} & styles.Variants;
export declare const Avatar: ({ as, label, placeholder, noBorder, shape, size, src, }: Props) => JSX.Element;
