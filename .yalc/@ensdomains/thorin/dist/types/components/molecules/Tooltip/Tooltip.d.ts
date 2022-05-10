import * as React from 'react';
import { DynamicPopoverPopover, DynamicPopoverProps } from '../../atoms/DynamicPopover';
export interface TooltipProps extends Omit<DynamicPopoverProps, 'popover'> {
    content?: React.ReactNode;
}
export declare const TooltipPopover: import("styled-components").StyledComponent<"div", any, {} & DynamicPopoverPopover, never>;
export declare const Tooltip: {
    ({ content, ...props }: TooltipProps): JSX.Element;
    displayName: string;
};
