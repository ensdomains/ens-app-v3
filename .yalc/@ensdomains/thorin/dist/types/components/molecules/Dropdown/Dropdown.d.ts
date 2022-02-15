import * as React from 'react';
import { BoxProps } from '../..';
export declare type DropdownItem = {
    label: string;
    onClick(): void;
    color?: BoxProps['color'];
    disabled?: boolean;
};
export declare type BaseProps = {
    items: DropdownItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
    inner?: boolean;
    align?: 'left' | 'right';
    shortThrow?: boolean;
    keepOnTop?: boolean;
};
export declare const Dropdown: {
    ({ items, isOpen, setIsOpen, children, inner, align, shortThrow, keepOnTop, }: BaseProps): JSX.Element;
    displayName: string;
};
