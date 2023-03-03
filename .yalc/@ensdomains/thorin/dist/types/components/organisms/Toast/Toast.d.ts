import * as React from 'react';
import { TransitionState } from 'react-transition-state';
import { Space } from '../../..';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {
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
type InternalProps = {
    state: TransitionState;
};
export declare const TouchToast: ({ onClose, open, title, description, left, right, bottom, state, children, popped, setPopped, ...props }: {
    onClose: () => void;
    open: boolean;
    msToShow?: number | undefined;
    title: string;
    description?: string | undefined;
    children?: NativeDivProps['children'];
    top?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
    left?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
    right?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
    bottom?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
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
