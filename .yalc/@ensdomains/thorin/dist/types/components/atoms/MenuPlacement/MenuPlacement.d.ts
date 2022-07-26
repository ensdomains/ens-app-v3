import * as React from 'react';
declare type MenuPortalProps = {
    appendTo: HTMLElement | null;
    control: HTMLElement | null;
    listenTo?: HTMLElement | null;
    isListening?: boolean;
};
export declare type Props = {
    appendTo?: MenuPortalProps['appendTo'];
    control?: MenuPortalProps['control'];
    listenTo?: MenuPortalProps['listenTo'];
    isListening?: MenuPortalProps['isListening'];
};
export declare const MenuPlacement: {
    ({ appendTo, control, listenTo, isListening, children, }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
export {};
