import * as React from 'react';
import { ButtonProps } from '@/src/components/atoms/Button';
import { Colors } from '@/src/tokens';
declare type Align = 'left' | 'right';
declare type LabelAlign = 'flex-start' | 'flex-end' | 'center';
declare type Direction = 'down' | 'up';
declare type Size = 'small' | 'medium';
declare type DropdownItemObject = {
    label: string;
    onClick?: (value?: string) => void;
    wrapper?: (children: React.ReactNode, key: React.Key) => JSX.Element;
    as?: 'button' | 'a';
    value?: string;
    color?: Colors;
    disabled?: boolean;
};
export declare type DropdownItem = DropdownItemObject | React.ReactElement<React.PropsWithRef<any>>;
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Props = {
    children?: React.ReactNode;
    buttonProps?: ButtonProps;
    inner?: boolean;
    chevron?: boolean;
    align?: Align;
    shortThrow?: boolean;
    keepMenuOnTop?: boolean;
    items: DropdownItem[];
    size?: Size;
    label?: React.ReactNode;
    menuLabelAlign?: LabelAlign;
    isOpen?: boolean;
    direction?: Direction;
} & NativeDivProps;
declare type PropsWithIsOpen = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
declare type PropsWithoutIsOpen = {
    isOpen?: never;
    setIsOpen?: never;
};
export declare const Dropdown: {
    ({ children, buttonProps, items, inner, chevron, align, menuLabelAlign, shortThrow, keepMenuOnTop, size, label, direction, isOpen: _isOpen, setIsOpen: _setIsOpen, ...props }: Props & (PropsWithIsOpen | PropsWithoutIsOpen)): JSX.Element;
    displayName: string;
};
export {};
