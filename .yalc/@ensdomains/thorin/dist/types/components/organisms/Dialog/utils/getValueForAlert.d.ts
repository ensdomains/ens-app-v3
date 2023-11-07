type Alert = 'error' | 'warning' | 'info';
type Properties = {
    svgTransform: string;
    backgroundColor: string;
    color: string;
};
export declare const getValueForAlert: <T extends keyof Properties>(alert: Alert, property: T) => Properties[T];
export {};
