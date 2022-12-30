import * as React from 'react';
import { WithAlert } from '@/src/types';
declare type BaseProps = React.PropsWithChildren<{
    message: string;
    title?: string;
    screen?: 'mobile' | 'desktop';
    as?: 'a';
    onDismiss?: () => void;
}> & React.HTMLAttributes<HTMLDivElement>;
declare type WithAnchor = {
    as: 'a';
    href: string;
    target?: string;
    rel?: string;
    onDismiss?: never;
};
declare type WithoutAnchor = {
    as?: never;
    href?: never;
    target?: never;
    rel?: never;
    onDismiss?: () => void;
};
export declare type Props = BaseProps & (WithAnchor | WithoutAnchor) & WithAlert;
export declare const Banner: {
    ({ message, title, alert, screen, as, href, onDismiss, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
