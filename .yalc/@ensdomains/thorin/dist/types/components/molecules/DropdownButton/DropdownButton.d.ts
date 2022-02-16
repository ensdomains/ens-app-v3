import * as React from 'react';
import type { Props as ButtonProps } from '../../atoms/Button';
import type { DropdownProps } from '../Dropdown';
import * as styles from './styles.css';
declare type Props = {
    children: React.ReactNode;
    buttonProps?: Partial<ButtonProps>;
    dropdownItems: DropdownProps['items'];
    inner?: boolean;
    chevron?: boolean;
    align?: 'left' | 'right';
    shortThrow?: boolean;
    keepMenuOnTop?: boolean;
    size?: styles.Size;
};
export declare const DropdownButton: ({ children, buttonProps, dropdownItems, inner, chevron, align, shortThrow, keepMenuOnTop, size, }: Props) => JSX.Element;
export {};
