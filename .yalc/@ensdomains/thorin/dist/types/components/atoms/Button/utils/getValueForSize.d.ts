import type { Size } from '../Button';
type Properties = {
    fontSize: string;
    lineHeight: string;
    height: string;
    px: string;
    svgSize: string;
};
export declare const getValueForSize: <T extends keyof Properties>(size: Size, property: T) => Properties[T];
export {};
