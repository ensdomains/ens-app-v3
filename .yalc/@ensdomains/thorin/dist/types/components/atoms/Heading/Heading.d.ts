import * as React from 'react';
import { BoxProps } from '../Box';
import * as styles from './styles.css';
declare type Props = {
    align?: BoxProps['textAlign'];
    as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'legend';
    children?: React.ReactNode;
    color?: BoxProps['color'];
    id?: string;
    transform?: BoxProps['textTransform'];
    responsive?: boolean;
} & styles.Variants;
export declare const Heading: ({ align, as, children, color, id, level, responsive, transform, }: Props) => JSX.Element;
export {};
