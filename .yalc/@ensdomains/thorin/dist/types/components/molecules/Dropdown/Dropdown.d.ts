import * as React from 'react';
import { ButtonProps } from '../../../components/atoms/Button';
import { Colors } from '../../../tokens';
type Align = 'left' | 'right';
type LabelAlign = 'flex-start' | 'flex-end' | 'center';
type Direction = 'down' | 'up';
type Size = 'small' | 'medium';
type DropdownItemObject = {
    label: string;
    onClick?: (value?: string) => void;
    wrapper?: (children: React.ReactNode, key: React.Key) => JSX.Element;
    as?: 'button' | 'a';
    icon?: React.ReactNode;
    value?: string;
    color?: Colors;
    disabled?: boolean;
};
export type DropdownItem = DropdownItemObject | React.ReactElement<React.PropsWithRef<any>>;
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {
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
    inheritContentWidth?: boolean;
} & NativeDivProps;
type PropsWithIsOpen = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type PropsWithoutIsOpen = {
    isOpen?: never;
    setIsOpen?: never;
};
export declare const Dropdown: {
    ({ children, buttonProps, items, inner, chevron, align, menuLabelAlign, shortThrow, keepMenuOnTop, size, label, direction, isOpen: _isOpen, setIsOpen: _setIsOpen, inheritContentWidth, ...props }: Props & (PropsWithIsOpen | PropsWithoutIsOpen)): JSX.Element;
    displayName: string;
};
export {};
