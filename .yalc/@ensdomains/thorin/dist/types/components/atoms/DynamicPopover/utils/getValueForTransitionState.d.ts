import { TransitionState } from 'react-transition-state';
declare const transitionStateValues: {
    [key in TransitionState['status']]: {
        display: string;
        visibility: string;
        opacity: number;
        transitionProperty: string;
        pointerEvents: string;
        topFunc: (x: number) => string;
        leftFunc: (y: number) => string;
    };
};
type Property = keyof typeof transitionStateValues['unmounted'];
export declare const getValueForTransitionState: (state: TransitionState['status'], property: Property) => any;
export {};
