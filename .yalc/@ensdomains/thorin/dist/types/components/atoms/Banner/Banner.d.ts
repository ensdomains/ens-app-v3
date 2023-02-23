import * as React from 'react';
import { WithAlert } from '../../../types';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type IconTypes = 'filledCircle' | 'normal' | 'none';
type BaseProps = {
    /** The title for the banner */
    title?: string;
    as?: 'a';
    onDismiss?: () => void;
    actionIcon?: React.ReactNode;
    icon?: React.ReactNode;
    iconType?: IconTypes;
} & NativeDivProps;
type WithIcon = {
    icon?: React.ReactNode;
    iconType?: Omit<IconTypes, 'none'>;
};
type WithoutIcon = {
    icon?: never;
    iconType: 'none';
};
type WithAnchor = {
    as: 'a';
    href?: string;
    target?: string;
    rel?: string;
    onDismiss?: never;
    actionIcon?: React.ReactNode;
};
type WithoutAnchor = {
    as?: never;
    href?: never;
    target?: never;
    rel?: never;
    onDismiss?: () => void;
};
export type Props = BaseProps & (WithAnchor | WithoutAnchor) & (WithIcon | WithoutIcon) & WithAlert;
export declare const Banner: {
    ({ title, alert, icon, iconType, as: asProp, children, onDismiss, ...props }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
export {};
