import { PrimaryColor } from '../../../../tokens/color3';
type Shade = 'Primary' | 'Secondary';
export type ColorStyle = PrimaryColor | `${PrimaryColor}${Shade}`;
export type WithColorStyle = {
    colorStyle: ColorStyle;
};
type Properties = {
    background: string;
    icon: string;
    iconHover: string;
    svg: string;
};
type Property = keyof Properties;
export declare const getValueForColorStyle: (colorStyle: ColorStyle, property: Property) => string;
export {};
