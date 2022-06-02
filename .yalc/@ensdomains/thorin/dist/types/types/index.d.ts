import * as React from 'react';
import { Accent as TokenAccent, Mode as TokenMode, Tokens } from '@/src/tokens';
export declare type AllOrNone<T> = T | {
    [K in keyof T]?: never;
};
export declare type ReactNodeNoStrings = React.ReactElement | React.ReactNodeArray | boolean | null | undefined;
export declare type EmptyObject = {
    [k: string]: unknown;
};
export declare type Accent = TokenAccent | 'foreground';
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
