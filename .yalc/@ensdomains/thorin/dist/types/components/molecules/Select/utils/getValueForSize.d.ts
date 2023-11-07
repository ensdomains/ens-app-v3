import { Size } from '../Select';
type Properties = {
    fontSize: string;
    lineHeight: string;
    height: string;
    outerPadding: string;
    iconWidth: string;
    rowHeight: string;
    maxHeightFunc: (rows: number) => string;
};
export declare const getValueForSize: <T extends keyof Properties>(size: Size, property: T) => Properties[T];
export {};
