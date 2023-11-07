import { AdditionalColor, PaletteColor, PrimaryColor } from '../tokens/color3';
export type Color = PrimaryColor | PaletteColor | AdditionalColor;
export type WithColor = {
    color?: Color;
};
export declare const validateColor: (color: unknown, fallback?: string) => string;
