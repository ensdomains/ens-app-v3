import type { Size } from '../ThemeToggle';
type Properties = {
    width: string;
    height: string;
    knobSize: string;
};
export declare const getValueForSize: <T extends keyof Properties>(size: Size, property: T) => Properties[T];
export {};
