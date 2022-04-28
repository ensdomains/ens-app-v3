import * as React from 'react';
export declare type DynamicPopoverSide = 'top' | 'right' | 'bottom' | 'left';
export declare type DynamicPopoverAlignment = 'start' | 'center' | 'end';
export declare type DynamicPopoverPlacement = 'top-start' | 'top-center' | 'top-end' | 'left-start' | 'left-center' | 'left-end' | 'right-start' | 'right-center' | 'right-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
export declare type DynamicPopoverPopover = React.ReactNode & {
    x?: number;
    y?: number;
    side?: DynamicPopoverSide;
    open?: boolean;
};
export declare type DynamicPopoverButton = React.ReactNode & {
    open?: boolean;
};
export interface DynamicPopoverProps {
    /** A react node that has the following properties:\no  open: boolean */
    children: DynamicPopoverButton;
    popover: DynamicPopoverPopover;
    placement?: DynamicPopoverPlacement;
    /** number of pixels between the button and the popover */
    offset?: number;
    /** number of pixels between the popover and the viewport */
    padding?: number;
    flip?: boolean;
    shift?: boolean;
}
export declare const computeCoordsFromPlacement: (reference: DOMRect, floating: DOMRect, placement: DynamicPopoverPlacement, padding: number, offset: number, flip?: boolean, shift?: boolean) => {
    x: number;
    y: number;
    side: DynamicPopoverSide;
};
export declare const DynamicPopover: {
    ({ popover, children, placement, offset, padding, flip, shift, }: DynamicPopoverProps): JSX.Element;
    displayName: string;
};
