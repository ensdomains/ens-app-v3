import * as React from 'react';
import { ButtonProps } from '../../../components/atoms/Button';
import { Colors } from '../../../tokens';
type Align = 'left' | 'right';
type LabelAlign = 'flex-start' | 'flex-end' | 'center';
type Direction = 'down' | 'up';
export type DropdownItemObject = {
    label: string;
    onClick?: (value?: string) => void;
    wrapper?: (children: React.ReactNode, key: React.Key) => JSX.Element;
    as?: 'button' | 'a';
    icon?: React.ReactNode;
    value?: string;
    color?: Colors;
    disabled?: boolean;
    showIndicator?: boolean | Colors;
};
export type DropdownItem = DropdownItemObject | React.ReactElement<React.PropsWithRef<any>>;
type Props = {
    /** An optional custom dropdown button */
    children?: React.ReactNode;
    /** The props passed to the button for the dropdown */
    buttonProps?: ButtonProps;
    /** A chevron in the button */
    chevron?: boolean;
    /** The alignment of the dropdown relative to the button */
    align?: Align;
    /** If true, decreases the distance of the dropdown animation. */
    shortThrow?: boolean;
    /** If true, the dropdown will stay above the button when open */
    keepMenuOnTop?: boolean;
    /** An array of objects conforming to the DropdownItem interface. */
    items: DropdownItem[];
    /** The label of the dropdown button */
    label?: React.ReactNode;
    /** The alignment of the menu button labels */
    menuLabelAlign?: LabelAlign;
    /** If defined, dropdown is controlled externally */
    isOpen?: boolean;
    /** The direction that the dropdown menu will open from */
    direction?: Direction;
    /** The width of the dropdown menu, in px */
    width?: string | number;
    /** The width of the dropdown menu on mobile, in px */
    mobileWidth?: string | number;
    /** The height of the dropdown menu. If specified, dropdown will be scrollable */
    height?: string | number;
    /** The colour of the indicator */
    indicatorColor?: Colors;
    /** If true, displays an action sheet when in mobile */
    responsive?: boolean;
    /** The label for the cancel button when showing an action sheet */
    cancelLabel?: string;
} & NativeDivProps;
type PropsWithIsOpen = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type PropsWithoutIsOpen = {
    isOpen?: never;
    setIsOpen?: never;
};
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Dropdown: {
    ({ children, buttonProps, items, chevron, align, menuLabelAlign, width, mobileWidth, shortThrow, keepMenuOnTop, label, direction, isOpen: _isOpen, setIsOpen: _setIsOpen, indicatorColor, responsive, cancelLabel, ...props }: Props & (PropsWithIsOpen | PropsWithoutIsOpen)): JSX.Element;
    displayName: string;
};
export {};
