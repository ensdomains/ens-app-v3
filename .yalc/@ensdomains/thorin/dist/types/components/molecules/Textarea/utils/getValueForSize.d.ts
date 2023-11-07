import type { Size } from '../Textarea';
type Properties = {
    actionSize: string;
    iconSize: string;
    fontSize: string;
    paddingY: string;
    paddingX: string;
    paddingAction: string;
};
type Property = keyof Properties;
export declare const getValueForSize: <T extends keyof Properties>(size: NonNullable<Size>, property: Property) => Properties[T];
export {};
