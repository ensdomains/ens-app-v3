import type { PrimaryColor } from '../../../tokens/color3';
import * as React from 'react';
import { Color } from './utils/getValidatedColor';
export type Size = 'extraSmall' | 'small' | 'medium';
export type Props = {
    size?: Size;
    fiat?: string;
    color?: Color;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export declare const CurrencyToggle: React.ForwardRefExoticComponent<{
    size?: Size | undefined;
    fiat?: string | undefined;
    color?: PrimaryColor | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & React.RefAttributes<HTMLInputElement>>;
