import { PrimaryColor } from '../../../../tokens/color3';
export type Color = PrimaryColor;
export type WithColor = {
    color: Color;
};
export declare const getValidatedColor: (color?: Color, fallback?: string) => string;
