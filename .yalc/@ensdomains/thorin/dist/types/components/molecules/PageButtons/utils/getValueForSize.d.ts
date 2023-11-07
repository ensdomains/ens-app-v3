import type { Size } from '../PageButtons';
type Properties = {
    fontSize: string;
    lineHeight: string;
    borderRadius: string;
    minWidth: string;
    height: string;
};
export declare const getValueForSize: <T extends keyof Properties>(size: Size, property: T) => Properties[T];
export {};
