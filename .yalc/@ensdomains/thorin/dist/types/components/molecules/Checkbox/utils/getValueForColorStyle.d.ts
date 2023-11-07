import { PrimaryColor } from '../../../../tokens/color3';
type Shade = 'Primary' | 'Secondary';
type ColorStyle = PrimaryColor | `${PrimaryColor}${Shade}`;
export type WithColorStyle = {
    colorStyle?: ColorStyle;
};
type Properties = {
    background: string;
    content: string;
};
type Property = keyof Properties;
export declare const getValueForColorStyle: (colorStyle: ColorStyle, property: Property) => string;
export {};
