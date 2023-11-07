import * as React from 'react';
import { ColorStyle } from './utils/getValueForColorStyle';
export type Props = {
    label: string;
    subLabel?: string;
    colorStyle?: ColorStyle;
} & React.InputHTMLAttributes<HTMLInputElement>;
export declare const CheckboxRow: React.ForwardRefExoticComponent<{
    label: string;
    subLabel?: string | undefined;
    colorStyle?: ColorStyle | undefined;
} & React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
