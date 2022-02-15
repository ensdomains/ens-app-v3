import { StyleRule } from '@vanilla-extract/css';
import { CSSVarFunction } from '@vanilla-extract/private';
import { Accent, Mode } from '../tokens';
export declare const rgb: (partial: string, alpha?: string | CSSVarFunction | undefined) => string;
export declare const solidFromShadeRgb: (partial: string, alpha?: string | undefined) => string;
export declare const getAccentText: (mode: Mode, accent: Accent | 'foreground') => string;
export declare const getModeColors: (mode: Mode) => {
    blue: string;
    green: string;
    red: string;
    indigo: string;
    orange: string;
    pink: string;
    purple: string;
    teal: string;
    yellow: string;
    grey: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    foreground: string;
    groupBackground: string;
    groupBorder: string;
    gradients: {
        blue: string;
        green: string;
        red: string;
    };
} | {
    blue: string;
    green: string;
    red: string;
    indigo: string;
    orange: string;
    pink: string;
    purple: string;
    teal: string;
    yellow: string;
    grey: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    foreground: string;
    groupBackground: string;
    groupBorder: string;
    gradients: {
        blue: string;
        green: string;
        red: string;
    };
};
export declare const getVarName: (_value: string | null, path: string[]) => string;
export declare const motionSafe: (style: StyleRule) => {
    '@media': {
        '(prefers-reduced-motion: no-preference)': StyleRule;
    };
};
