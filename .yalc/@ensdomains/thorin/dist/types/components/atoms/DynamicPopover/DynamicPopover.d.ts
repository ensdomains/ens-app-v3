import * as React from 'react';
export type DynamicPopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type DynamicPopoverAlignment = 'start' | 'center' | 'end';
export type PopoverProps = React.PropsWithChildren<{
    placement: DynamicPopoverSide;
    mobilePlacement: DynamicPopoverSide;
}>;
export type DynamicPopoverAnimationFunc = (horizonalClearance: number, verticalClearance: number, side: DynamicPopoverSide, mobileSide: DynamicPopoverSide) => {
    translate: string;
    mobileTranslate: string;
};
export type DynamicPopoverButtonProps = {
    pressed?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement>;
};
export interface DynamicPopoverProps {
    /** A react node that has includes the styling and content of the popover */
    popover: React.ReactElement<PopoverProps>;
    /** The side and alignment of the popover in relation to the target */
    placement?: DynamicPopoverSide;
    /** The side and alignment of the popover in relation to the target on mobile screen sizes */
    mobilePlacement?: DynamicPopoverSide;
    /** A function that returns string of the css state for open and closed popover */
    animationFn?: DynamicPopoverAnimationFunc;
    /** The id of the target element the tooltip will emerge from */
    anchorRef: React.RefObject<HTMLDivElement>;
    /** Function that will be called when the DynamicPopover is shown */
    onShowCallback?: () => void;
    /** Width of the DynamicPopover*/
    width?: number;
    /** Width of the DynamicPopover on mobile*/
    mobileWidth?: number;
    /** Dynamic popover will switch sides if there is not enough room*/
    useIdealPlacement?: boolean;
    /** Add to the default gap between the popover and its target */
    additionalGap?: number;
}
export declare const DynamicPopover: {
    ({ popover, placement, mobilePlacement, animationFn: _animationFn, anchorRef, onShowCallback, width, mobileWidth, useIdealPlacement, additionalGap, }: DynamicPopoverProps): React.ReactPortal;
    displayName: string;
};
