import * as React from 'react';
import { Mode, Accent as TokenAccent } from '../../../tokens';
declare type Accent = TokenAccent | 'foreground';
declare type ThemeContextValue = {
    /** Active accent name */
    accent: Accent;
    /** Forced accent name */
    forcedAccent?: Accent;
    /** Forced mode name */
    forcedMode?: Mode;
    /** Active mode name */
    mode: Mode;
    /** Update accent */
    setAccent(accent: Accent): void;
    /** Update mode */
    setMode(mode: Mode): void;
};
export declare const attribute = "data-theme";
export declare type ThemeProviderProps = {
    /** Default accent name. */
    defaultAccent?: Accent;
    /** Default mode name. */
    defaultMode?: Mode;
    /** Element to bind theme */
    element?: string | HTMLElement;
    /** Forced accent name */
    forcedAccent?: Accent;
    /** Forced mode name */
    forcedMode?: Mode;
};
export declare const ThemeProvider: ({ children, defaultAccent, defaultMode, element, forcedAccent, forcedMode, }: React.PropsWithChildren<ThemeProviderProps>) => JSX.Element;
export declare const useTheme: () => ThemeContextValue;
export {};
