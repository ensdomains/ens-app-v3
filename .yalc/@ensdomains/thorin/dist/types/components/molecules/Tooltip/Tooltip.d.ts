import * as React from 'react';
import { DynamicPopoverProps, DynamicPopoverSide } from '../../../components/atoms/DynamicPopover';
export interface TooltipProps extends Omit<DynamicPopoverProps, 'popover' | 'animationFn'> {
    /** The side and alignment of the popover in relation to the target */
    placement?: DynamicPopoverSide;
    /** The side and alignment of the popover in relation to the target on mobile screen sizes */
    mobilePlacement?: DynamicPopoverSide;
    /** A React reference to the tooltip element */
    tooltipRef?: React.RefObject<HTMLDivElement>;
    /** The id of the target element the tooltip will emerge from */
    targetId: string;
    /** Function that will be called when the DynamicPopover is shown */
    onShowCallback?: () => void;
    /** Width of the DynamicPopover*/
    width?: number;
    /** Width of the DynamicPopover on mobile*/
    mobileWidth?: number;
    /** Dynamic popover will switch sides if there is not enough room*/
    useIdealSide?: boolean;
    /** Add to the default gap between the popover and its target */
    additionalGap?: number;
    /** A text or component containg the content of the popover. */
    content?: React.ReactNode;
}
export declare const Tooltip: {
    ({ content, placement, mobilePlacement, ...props }: TooltipProps): React.ReactPortal;
    displayName: string;
};
