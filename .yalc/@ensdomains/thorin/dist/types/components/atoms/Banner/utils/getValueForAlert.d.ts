import { Alert } from '../../../../types';
type Properties = {
    background: string;
    border: string;
    hover: string;
    icon: string;
    svg: string;
    actionIcon: string;
    actionSvg: string;
    actionIconHover: string;
    actionSvgHover: string;
};
type Property = keyof Properties;
export type WithAlert = {
    alert?: Alert;
};
export declare const getValueForAlert: <T extends keyof Properties>(alert: Alert, property: Property) => Properties[T];
export {};
