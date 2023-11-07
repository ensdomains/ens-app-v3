import { Sprinkles } from '../../../../css/rainbow-spinkles.css';
import type { StepType } from '../Dialog';
type Properties = {
    borderWidth: Sprinkles['borderWidth'];
    borderColor: string;
    backgroundColor: string;
};
export declare const getValueForStepType: <T extends keyof Properties>(stepType: StepType, property: T) => Properties[T];
export {};
