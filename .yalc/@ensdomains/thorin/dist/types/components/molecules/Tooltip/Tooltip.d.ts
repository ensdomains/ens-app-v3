import * as React from 'react';
import { DynamicPopoverProps } from '../../../components/atoms/DynamicPopover';
import { Colors } from '../../../tokens';
export interface TooltipProps extends Omit<DynamicPopoverProps, 'popover' | 'animationFn' | 'anchorRef'> {
    /** A text or component containg the content of the popover. */
    content?: React.ReactNode;
    /** The background color for the tooltip */
    background?: Colors;
    /** The anchor element for the popover */
    children: React.ReactElement;
}
export declare const Tooltip: {
    ({ content, background, placement, mobilePlacement, children, ...props }: TooltipProps): React.JSX.Element;
    displayName: string;
};
