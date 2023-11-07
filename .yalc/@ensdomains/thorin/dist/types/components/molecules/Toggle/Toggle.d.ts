import type { PrimaryColor } from '../../../tokens/color3';
import * as React from 'react';
import { Color } from './utils/getValidatedColor';
export type Size = 'small' | 'medium' | 'large';
export type Props = {
    size?: Size;
    color?: Color;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;
export declare const Toggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
    color?: PrimaryColor | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & React.RefAttributes<HTMLInputElement>>;
