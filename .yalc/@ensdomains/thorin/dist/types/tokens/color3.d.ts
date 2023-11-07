/** PRIMARY COLORS */
export type Mode = 'light' | 'dark';
export type PrimaryColor = 'accent' | 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'indigo' | 'pink' | 'purple' | 'grey';
export type RawColor = Readonly<[number, number, number]>;
export declare const PRIMARY_COLORS: PrimaryColor[];
export declare const validatePrimaryColor: (colour: unknown, fallback?: PrimaryColor) => PrimaryColor;
/** PALETTE COLOR */
export type Shade = 'active' | 'dim' | 'primary' | 'bright' | 'light' | 'surface';
export type Shades = {
    [key in Shade]: RawColor;
};
export type Palette = {
    [key in PrimaryColor]: Shades;
};
export declare const RAW_PALETTE_LIGHT: Palette;
export declare const RAW_PALETTE_DARK: Palette;
export type PaletteColor = `${PrimaryColor}${Capitalize<Shade>}` | PrimaryColor;
export declare const PALETTE_COLORS: PaletteColor[];
export type RawPalettes = {
    [key in Mode]: Palette;
};
export declare const RAW_PALETTE_COLORS: RawPalettes;
/** ADDITIONAL COLORS */
export type AdditionalColor = 'black' | 'white' | 'text' | 'textPrimary' | 'textSecondary' | 'textAccent' | 'textDisabled' | 'background' | 'backgroundPrimary' | 'backgroundSecondary' | 'border';
export declare const ADDITIONAL_COLORS: AdditionalColor[];
export type RawAdditionalColors = {
    [key in Mode]: {
        [key in AdditionalColor]: RawColor;
    };
};
export declare const RAW_ADDITIONAL_COLORS: RawAdditionalColors;
/** GRADIENTS */
type Gradient = 'blueGradient' | 'greenGradient' | 'redGradient' | 'purpleGradient' | 'greyGradient';
export type Color = PaletteColor | AdditionalColor | Gradient;
export declare const rawColorToRGB: (color: readonly [number, number, number]) => string;
export declare const rawColorToRGBA: (color: readonly [number, number, number], opacity?: number) => string;
export declare const rawColorToHex: (color: readonly [number, number, number]) => string;
export declare const rawColorToHSL: ([r, g, b]: readonly [number, number, number]) => string;
export declare const lightColors: {
    [key in Color]: string;
};
export declare const darkColors: {
    [key in Color]: string;
};
export {};
