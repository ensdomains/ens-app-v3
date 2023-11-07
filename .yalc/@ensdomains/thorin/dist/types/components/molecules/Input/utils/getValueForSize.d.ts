import { Size } from '../Input';
type Properties = {
    height: string;
    outerPadding: string;
    innerPadding: string;
    gap: string;
    icon: string;
    iconPadding: string;
    labelFontSize: string;
    borderRadius: string;
};
type Property = keyof Properties;
export declare const getValueForSize: (size: Size, property: Property) => string;
export {};
