import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
import { BoxProps } from '../Box';
import * as styles from './styles.css';
declare type NativeButtonProps = React.AllHTMLAttributes<HTMLButtonElement>;
declare type NativeAnchorProps = React.AllHTMLAttributes<HTMLAnchorElement>;
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
    shape?: styles.Shape;
    /** Sets dimensions and layout  */
    size?: styles.Size;
    /** Adds ReactNode after children */
    suffix?: ReactNodeNoStrings;
    tabIndex?: NativeButtonProps['tabIndex'];
    type?: NativeButtonProps['type'];
    variant?: styles.Variant;
    width?: BoxProps['width'];
    zIndex?: BoxProps['zIndex'];
    pressed?: boolean;
    shadowless?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement> | undefined;
};
declare type WithTone = {
    tone?: styles.Tone;
    variant?: 'primary' | 'secondary';
};
declare type WithoutTone = {
    tone?: never;
    variant?: styles.Variant;
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
