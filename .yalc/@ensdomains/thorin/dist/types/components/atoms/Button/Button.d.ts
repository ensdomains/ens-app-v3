import * as React from 'react';
import { Space } from '@/src/tokens';
import { ReactNodeNoStrings, WithColor } from '../../../types';
export declare type Size = 'small' | 'medium' | 'flexible';
declare type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
declare type NativeAnchorProps = React.AllHTMLAttributes<HTMLAnchorElement>;
declare type BaseProps = {
    /** An alternative element type to render the component as.*/
    as?: 'a';
    children: NativeButtonProps['children'];
    /** If true, prevents user interaction with button. */
    disabled?: NativeButtonProps['disabled'];
    /** Insert a ReactNode before the children */
    prefix?: ReactNodeNoStrings;
    /** Shows loading spinner inside button */
    loading?: boolean;
    /** Constrains button to specific shape */
    shape?: 'square' | 'rounded' | 'circle';
    /** Sets dimensions and layout  */
    size?: Size;
    /** Adds ReactNode after children */
    suffix?: ReactNodeNoStrings;
    /** The zIndex attribute for button element. */
    zIndex?: string;
    /** If true, sets the style to indicate "on" state. Useful for toggles switches. */
    pressed?: boolean;
    /** If true, adds a box-shadow */
    shadow?: boolean;
    /** A space value for the width of the button */
    width?: Space;
    /** If true, makes inner div full width */
    fullWidthContent?: boolean;
    /** When set, shows a count indicator on the button */
    count?: number;
    /** The handler for click events. */
    onClick?: NativeButtonProps['onClick'];
} & Omit<NativeButtonProps, 'prefix' | 'size'>;
declare type WithAnchor = {
    /** The href attribute for the anchor element. */
    href?: NativeAnchorProps['href'];
    /** The rel attribute for the anchor element. */
    rel?: NativeAnchorProps['rel'];
    /** The target attribute for the anchor element. */
    target?: NativeAnchorProps['target'];
};
declare type WithoutAnchor = {
    href?: never;
    rel?: never;
    target?: never;
};
export declare type Props = BaseProps & (WithoutAnchor | WithAnchor) & WithColor;
export declare const Button: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
export {};
