import * as React from 'react';
import { TransitionState } from 'react-transition-state';
import { Space } from '@/src';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Props = {
    onClose: () => void;
    open: boolean;
    msToShow?: number;
    title: string;
    description?: string;
    children?: NativeDivProps['children'];
    top?: Space;
    left?: Space;
    right?: Space;
    bottom?: Space;
    variant?: 'touch' | 'desktop';
} & Omit<NativeDivProps, 'title'>;
declare type InternalProps = {
    state: TransitionState;
};
export declare const TouchToast: ({ onClose, open, title, description, left, right, bottom, state, children, popped, setPopped, ...props }: {
    onClose: () => void;
    open: boolean;
    msToShow?: number | undefined;
    title: string;
    description?: string | undefined;
    children?: NativeDivProps['children'];
    top?: any;
    left?: any;
    right?: any;
    bottom?: any;
    variant?: "touch" | "desktop" | undefined;
} & Omit<NativeDivProps, "title"> & InternalProps & {
    popped: boolean;
    setPopped: (popped: boolean) => void;
}) => JSX.Element;
export declare const Toast: {
    ({ onClose, open, msToShow, variant, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
