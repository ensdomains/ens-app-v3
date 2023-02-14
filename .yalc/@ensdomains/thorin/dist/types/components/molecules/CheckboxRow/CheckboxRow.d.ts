import * as React from 'react';
import { Hue } from '../../../tokens';
export type Props = {
    label: string;
    color?: Hue;
} & React.InputHTMLAttributes<HTMLInputElement>;
export declare const CheckboxRow: React.ForwardRefExoticComponent<{
    label: string;
    color?: "blue" | "indigo" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "teal" | "grey" | undefined;
} & React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
