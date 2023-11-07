import * as React from 'react';
type Mode = 'dark' | 'light';
type ThemeContextValue = {
    mode: Mode;
    setMode: (mode: Mode) => void;
};
type Props = {
    defaultMode?: Mode;
};
export declare const ThemeProvider: ({ defaultMode, children, }: React.PropsWithChildren<Props>) => React.JSX.Element;
export declare const useTheme: () => ThemeContextValue;
export {};
