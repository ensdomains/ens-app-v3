import * as React from 'react';
import { DynamicPopoverProps } from '@/src/components/atoms/DynamicPopover';
export interface TooltipProps extends Omit<DynamicPopoverProps, 'popover' | 'animationFn'> {
    /** A text or component containg the content of the popover. */
    content?: React.ReactNode;
}
export declare const Tooltip: {
    ({ content, ...props }: TooltipProps): any;
    displayName: string;
};
