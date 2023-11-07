import { commonVars } from '../../../../css/theme.css';
import type { Size } from '../Toggle';
type Properties = {
    width: string;
    height: string;
    knobSize: keyof typeof commonVars.space;
    translateX: keyof typeof commonVars.space;
};
export declare const getValueForSize: <T extends keyof Properties>(size: Size, property: T) => Properties[T];
export {};
