import { Accent, Tokens } from '../tokens';
declare type BaseColors = Tokens['colors']['base'] & {
    [key in Accent]: string;
};
declare type ThemeColors = BaseColors & {
    accent: string;
    accentText: string;
    accentSecondary?: string;
    accentSecondaryHover?: string;
    accentTertiary?: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    foreground: string;
    foregroundSecondary: string;
    foregroundSecondaryHover: string;
    foregroundTertiary: string;
    groupBackground: string;
    groupBorder: string;
    text: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
};
declare type ThemeMode = {
    colors: Tokens['colors']['light'];
    shades: Tokens['shades']['light'];
};
export declare type Theme = {
    borderStyles: Tokens['borderStyles'];
    borderWidths: Tokens['borderWidths'];
    colors: ThemeColors;
    fonts: Tokens['fonts'];
    fontSizes: Tokens['fontSizes'];
    fontWeights: Tokens['fontWeights'];
    letterSpacings: Tokens['letterSpacings'];
    lineHeights: Tokens['lineHeights'];
    opacity: Tokens['opacity'];
    mode: ThemeMode;
    radii: Tokens['radii'];
    shadows: Tokens['shadows'];
    space: Tokens['space'];
};
export {};
