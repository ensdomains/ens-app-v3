import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
export declare type Size = 'extraSmall' | 'small' | 'medium';
declare type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
declare type NativeAnchorProps = React.AllHTMLAttributes<HTMLAnchorElement>;
declare type Variant = 'primary' | 'secondary' | 'action' | 'transparent';
declare type Tone = 'accent' | 'blue' | 'green' | 'red';
declare type BaseProps = {
    /** An alternative element type to render the component as.*/
    as?: 'a';
    /** Centers text and reserves space for icon and spinner */
    center?: boolean;
    children: NativeButtonProps['children'];
    /** If true, prevents user interaction with button. */
    disabled?: boolean;
    /** Insert a ReactNode before the children */
    prefix?: ReactNodeNoStrings;
    /** Shows loading spinner inside button */
    loading?: boolean;
    /** Constrains button to specific shape */
    shape?: 'square' | 'circle';
    /** Sets dimensions and layout  */
    size?: Size;
    /** Adds ReactNode after children */
    suffix?: ReactNodeNoStrings;
    /** The tabIndex attribute for button elemnt. */
    tabIndex?: NativeButtonProps['tabIndex'];
    /** The type attribute for button element. */
    type?: NativeButtonProps['type'];
    /** Sets the styling of the component.  */
    variant?: Variant;
    /** The zIndex attribute for button element. */
    zIndex?: string;
    /** If true, sets the style to indicate "on" state. Useful for toggles switches. */
    pressed?: boolean;
    /** If true, removes the box-shadow */
    shadowless?: boolean;
    /** The handler for click events. */
    onClick?: React.MouseEventHandler<HTMLElement> | undefined;
};
declare type WithTone = {
    /** Sets the color scheme when variant is 'primary' or 'action' */
    tone?: Tone;
    variant?: 'primary' | 'action';
};
declare type WithoutTone = {
    tone?: never;
    variant?: Variant;
};
declare type WithAnchor = {
    /** The href attribute for the anchor element. */
    href?: string;
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
export declare type Props = BaseProps & (WithTone | WithoutTone) & (WithoutAnchor | WithAnchor);
export declare const Button: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
export {};
