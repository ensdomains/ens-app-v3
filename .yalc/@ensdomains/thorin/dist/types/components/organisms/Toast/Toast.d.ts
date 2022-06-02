import * as React from 'react';
import { TransitionState } from 'react-transition-state';
import { Space } from '@/src';
declare type Props = {
    onClose: () => void;
    open: boolean;
    msToShow?: number;
    title: string;
    description?: string;
    children?: React.ReactNode;
    top?: Space;
    left?: Space;
    right?: Space;
    bottom?: Space;
    variant?: 'touch' | 'desktop';
};
declare type InternalProps = {
    state: TransitionState;
};
export declare const TouchToast: ({ onClose, open, title, description, left, right, bottom, state, children, popped, setPopped, }: Props & InternalProps & {
    popped: boolean;
    setPopped: (popped: boolean) => void;
}) => JSX.Element;
export declare const Toast: {
    ({ onClose, open, msToShow, variant, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
