import * as React from 'react';
import { Space } from '../../../tokens';
import { WithColorStyle } from '../../../types/withColorOrColorStyle';
import { ReactNodeNoStrings } from '../../../types';
export type Size = 'small' | 'medium' | 'flexible';
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type NativeAnchorProps = React.AllHTMLAttributes<HTMLAnchorElement>;
type BaseProps = {
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
    /** Show indicator that button has extra info via tooltip. */
    shouldShowTooltipIndicator?: boolean;
} & Omit<NativeButtonProps, 'prefix' | 'size'>;
type WithAnchor = {
    /** The href attribute for the anchor element. */
    href?: NativeAnchorProps['href'];
    /** The rel attribute for the anchor element. */
    rel?: NativeAnchorProps['rel'];
    /** The target attribute for the anchor element. */
    target?: NativeAnchorProps['target'];
};
type WithoutAnchor = {
    href?: never;
    rel?: never;
    target?: never;
};
export type Props = BaseProps & (WithoutAnchor | WithAnchor) & WithColorStyle;
export declare const Button: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
export {};
