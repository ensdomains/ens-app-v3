import * as React from 'react';
import { Space } from '@/src/tokens';
declare type Shape = 'circle' | 'square';
export declare type Props = {
    as?: 'img' | React.ComponentType;
    label: string;
    placeholder?: boolean;
    noBorder?: boolean;
    size?: Space;
    src?: string;
    shape?: Shape;
};
export declare const Avatar: ({ label, placeholder, noBorder, shape, size, src, }: Props) => JSX.Element;
export {};
