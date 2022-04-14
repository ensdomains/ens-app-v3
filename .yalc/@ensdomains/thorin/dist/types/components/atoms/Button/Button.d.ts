import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
export declare type Size = 'small' | 'medium';
declare type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
declare type NativeAnchorProps = React.AllHTMLAttributes<HTMLAnchorElement>;
declare type Variant = 'primary' | 'secondary' | 'action' | 'transparent';
declare type Tone = 'accent' | 'blue' | 'green' | 'red';
declare type BaseProps = {
    /** Centers text and reserves space for icon and spinner */
    center?: boolean;
    children: NativeButtonProps['children'];
    /** Marks as unusable */
    disabled?: boolean;
    /** Adds ReactNode before children */
    prefix?: ReactNodeNoStrings;
    /** Shows loading spinner inside button */
    loading?: boolean;
    /** Constrains button to specific shape */
    shape?: 'square' | 'circle';
    /** Sets dimensions and layout  */
    size?: Size;
    /** Adds ReactNode after children */
    suffix?: ReactNodeNoStrings;
    tabIndex?: NativeButtonProps['tabIndex'];
    type?: NativeButtonProps['type'];
    variant?: Variant;
    width?: string;
    zIndex?: string;
    pressed?: boolean;
    shadowless?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement> | undefined;
};
declare type WithTone = {
    tone?: Tone;
    variant?: 'primary' | 'secondary';
};
declare type WithoutTone = {
    tone?: never;
    variant?: Variant;
};
declare type WithAnchor = {
    as?: 'a';
    href?: string;
    rel?: NativeAnchorProps['rel'];
    target?: NativeAnchorProps['target'];
};
declare type WithoutAnchor = {
    as?: 'button';
    href?: never;
    rel?: never;
    target?: never;
};
export declare type Props = BaseProps & (WithTone | WithoutTone) & (WithAnchor | WithoutAnchor);
export declare const Button: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
export {};
