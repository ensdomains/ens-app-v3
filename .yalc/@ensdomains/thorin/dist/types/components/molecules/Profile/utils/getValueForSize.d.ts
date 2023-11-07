import type { Size } from '../Profile';
type Properties = {
    height: string;
    padding: string;
    width: string;
    maxWidth: string;
    paddingRight: string;
};
type Property = keyof Properties;
export declare const getValueForSize: (size: Size, property: Property) => string;
export {};
