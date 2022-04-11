import * as React from 'react';
import { Props as ButtonProps } from '@/src/components/atoms/Button';
import { Colors } from '@/src/tokens';
export declare type DropdownItem = {
    label: string;
    onClick(): void;
    color?: Colors;
    disabled?: boolean;
};
declare type Props = {
    children?: React.ReactNode;
    buttonProps?: ButtonProps;
    inner?: boolean;
    chevron?: boolean;
    align?: 'left' | 'right';
    shortThrow?: boolean;
    keepMenuOnTop?: boolean;
    items: DropdownItem[];
    size?: 'small' | 'medium';
    label?: string;
};
export declare const Dropdown: {
    ({ children, buttonProps, items, inner, chevron, align, shortThrow, keepMenuOnTop, size, label, }: Props): JSX.Element;
    displayName: string;
};
export {};
