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
    label?: React.ReactNode;
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
    ({ children, buttonProps, items, inner, chevron, align, shortThrow, keepMenuOnTop, size, label, ...props }: Props & (PropsWithIsOpen | PropsWithoutIsOpen)): JSX.Element;
    displayName: string;
};
export {};
