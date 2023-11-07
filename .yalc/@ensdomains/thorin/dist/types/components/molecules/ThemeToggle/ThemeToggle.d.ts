import type { PrimaryColor } from '../../../tokens/color3';
import * as React from 'react';
import { Color } from './utils/getValidatedColor';
export type Size = 'extraSmall' | 'small' | 'medium';
export type Mode = 'light' | 'dark';
export type Props = {
    size?: Size;
    color?: Color;
    mode?: Mode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export declare const ThemeToggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
    color?: PrimaryColor | undefined;
    mode?: Mode | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & React.RefAttributes<HTMLInputElement>>;
