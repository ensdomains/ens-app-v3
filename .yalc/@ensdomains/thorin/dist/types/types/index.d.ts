import * as React from 'react';
import { Hue as TokenHue, Mode as TokenMode, Tokens } from '../tokens';
export declare type AllOrNone<T> = T | {
    [K in keyof T]?: never;
};
export type { Color, ColorStyle, WithColor, WithColorStyle, } from './withColorOrColorStyle';
export type { FontVariant, WithTypography } from './withTypography';
export declare type ReactNodeNoStrings = React.ReactElement | React.ReactNode[] | boolean | null | undefined;
export declare type EmptyObject = {
    [k: string]: unknown;
};
export declare type Accent = TokenHue | 'foreground';
export declare type Mode = TokenMode;
export declare type DefaultTheme = Tokens;
export declare type Size = 'small' | 'medium' | 'extraSmall' | undefined;
declare module 'styled-components' {
    interface DefaultTheme extends Tokens {
    }
}
export declare type OptionalTitle = AllOrNone<{
    title: string;
    titleId: string;
}>;
export declare type IconProps = React.SVGProps<SVGSVGElement> & OptionalTitle;
export declare type WithAlert = {
    alert?: 'error' | 'warning' | 'info';
};
export declare type Icon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
export declare type WithIcon = {
    /** An svg to be used by the component */
    icon?: React.ReactNode;
};
