import * as React from 'react';
import { Hue, Hue as TokenHue, Mode as TokenMode, Tokens } from '@/src/tokens';
export declare type AllOrNone<T> = T | {
    [K in keyof T]?: never;
};
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
export declare type WithColor = {
    color?: Hue | 'background' | 'accent';
    colorScheme?: 'primary' | 'secondary' | 'gradient' | 'transparent' | 'text';
};
export declare type WithAlert = {
    alert?: 'error' | 'warning' | 'info';
};
declare type LegacyTypography = 'small' | 'large' | 'extraLarge' | 'label' | 'labelHeading';
export declare type Typography = 'Heading/H1' | 'Heading/H2' | 'Heading/H3' | 'Heading/H4' | 'Large/XL Normal' | 'Large/XL Bold' | 'Large/Normal' | 'Large/Bold' | 'Body/Normal' | 'Body/Bold' | 'Small/Normal' | 'Small/Bold' | 'Small/XS Normal' | 'Small/XS Bold';
export declare type WithTypography = {
    typography?: Typography | LegacyTypography;
};
export {};
