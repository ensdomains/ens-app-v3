import type { Size } from '../CurrencyToggle';
type Properties = {
    width: string;
    height: string;
    borderRadius: string;
};
type Property = keyof Properties;
export declare const getValueForCheckbox: (size: Size, property: Property) => string;
export {};
