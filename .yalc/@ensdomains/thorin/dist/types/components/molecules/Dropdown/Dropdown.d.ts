import * as React from 'react';
import { Props as ButtonProps } from '@/src/components/atoms/Button';
import { Colors } from '@/src/tokens';
declare type DropdownItemObject = {
    label: string;
    onClick(): void;
    color?: Colors;
    disabled?: boolean;
};
export declare type DropdownItem = DropdownItemObject | React.ReactNode;
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
    label?: React.ReactNode;
    menuLabelAlign?: 'flex-start' | 'flex-end' | 'center';
    isOpen?: boolean;
};
declare type PropsWithIsOpen = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
declare type PropsWithoutIsOpen = {
    isOpen?: never;
    setIsOpen?: never;
};
export declare const Dropdown: {
    ({ children, buttonProps, items, inner, chevron, align, menuLabelAlign, shortThrow, keepMenuOnTop, size, label, ...props }: Props & (PropsWithIsOpen | PropsWithoutIsOpen)): JSX.Element;
    displayName: string;
};
export {};
