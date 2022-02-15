import * as React from 'react';
import * as styles from './styles.css';
export declare type Props = {
    as?: 'div' | 'span';
    label?: string;
} & styles.Variants;
export declare const Tag: ({ as, children, hover, label, size, tone, }: React.PropsWithChildren<Props>) => JSX.Element;
