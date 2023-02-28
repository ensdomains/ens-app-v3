import * as React from 'react';
import { WithAlert } from '../../../types';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type IconTypes = 'filledCircle' | 'normal' | 'none';
declare type BaseProps = {
    /** The title for the banner */
    title?: string;
    as?: 'a';
    onDismiss?: () => void;
    actionIcon?: React.ReactNode;
    icon?: React.ReactNode;
    iconType?: IconTypes;
} & NativeDivProps;
declare type WithIcon = {
    icon?: React.ReactNode;
    iconType?: Omit<IconTypes, 'none'>;
};
declare type WithoutIcon = {
    icon?: never;
    iconType: 'none';
};
declare type WithAnchor = {
    as: 'a';
    href?: string;
    target?: string;
    rel?: string;
    onDismiss?: never;
    actionIcon?: React.ReactNode;
};
declare type WithoutAnchor = {
    as?: never;
    href?: never;
    target?: never;
    rel?: never;
    onDismiss?: () => void;
};
export declare type Props = BaseProps & (WithAnchor | WithoutAnchor) & (WithIcon | WithoutIcon) & WithAlert;
export declare const Banner: {
    ({ title, alert, icon, iconType, as, children, onDismiss, ...props }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
export {};
