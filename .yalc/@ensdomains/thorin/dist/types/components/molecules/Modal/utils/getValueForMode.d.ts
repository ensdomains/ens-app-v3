type Mode = 'mobileTop' | 'mobileBottom' | 'desktop';
type Properties = {
    width: string;
    top: string;
    left: string;
    translate: string;
    transform: string;
    bottom: string;
};
type Property = keyof Properties;
export declare const getValueForMode: (mode: Mode, property: Property) => string;
export {};
