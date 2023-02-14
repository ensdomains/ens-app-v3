import * as React from 'react';
import { DynamicPopoverProps } from '../../../components/atoms/DynamicPopover';
export interface TooltipProps extends Omit<DynamicPopoverProps, 'popover' | 'animationFn' | 'anchorRef'> {
    /** A text or component containg the content of the popover. */
    content?: React.ReactNode;
    /** The anchor element for the popover */
    children: React.ReactElement;
}
export declare const Tooltip: {
    ({ content, placement, mobilePlacement, children, ...props }: TooltipProps): JSX.Element;
    displayName: string;
};
