import type { Alert } from '../../../../types';
type Properties = {
    background: string;
    border: string;
    svg: string;
};
type Property = keyof Properties;
export type WithAlert = {
    alert?: Alert;
};
export declare const getValueForAlert: <T extends keyof Properties>(alert: Alert, property: Property) => Properties[T];
export {};
