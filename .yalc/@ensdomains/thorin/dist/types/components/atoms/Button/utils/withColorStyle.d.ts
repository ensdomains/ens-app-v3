import { PrimaryColor } from '../../../../tokens/color3';
type Shade = 'Primary' | 'Secondary';
export type ColorStyle = PrimaryColor | `${PrimaryColor}${Shade}` | 'background' | 'disabled' | 'transparent';
export type WithColorStyle = {
    colorStyle?: ColorStyle;
};
type Properties = {
    background: string;
    content: string;
    hover: string;
    border: string;
};
type Property = keyof Properties;
export declare const getValueForColourStyle: (colorStyle: ColorStyle, property: Property) => string;
export {};
