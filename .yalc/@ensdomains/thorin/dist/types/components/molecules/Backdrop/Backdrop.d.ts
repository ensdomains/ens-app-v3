import * as React from 'react';
import { TransitionState } from 'react-transition-state';
declare type Props = {
    children: (renderProps: {
        state: TransitionState;
    }) => React.ReactNode;
    /** An element that provides backdrop styling. Defaults to BackdropSurface component. */
    surface?: React.ElementType;
    /** A event fired when the background is clicked. */
    onDismiss?: () => void;
    /** If true, backdrop and it's children are visible */
    open: boolean;
    /** If true, removes background */
    noBackground?: boolean;
    className?: string;
};
export declare const Backdrop: {
    ({ children, surface, onDismiss, noBackground, className, open, }: Props): JSX.Element | null;
    displayName: string;
};
export {};
