import { TransitionState } from 'react-transition-state';
import { Sprinkles } from '../../../../css/rainbow-spinkles.css';
import { Direction } from '../Select';
type Properties = {
    zIndex: string;
    visibility: Sprinkles['visibility'];
    top: string;
    bottom: string;
    opacity: string;
};
export declare const getValueForTransitionState: <T extends keyof Properties>(state: TransitionState['status'] | 'default', property: T, direction: Direction) => Properties[T];
export {};
