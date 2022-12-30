import * as React from 'react';
export declare type DynamicPopoverSide = 'top' | 'right' | 'bottom' | 'left';
export declare type DynamicPopoverAlignment = 'start' | 'center' | 'end';
export declare type DynamicPopoverPlacement = 'top-start' | 'top-center' | 'top-end' | 'left-start' | 'left-center' | 'left-end' | 'right-start' | 'right-center' | 'right-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
export declare type DynamicPopoverAnimationFunc = (side: DynamicPopoverSide, open?: boolean) => string;
export declare type DynamicPopoverButtonProps = {
    pressed?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement>;
};
export interface DynamicPopoverProps {
    /** A Button component. The component will override the onClick and pressed properties of the button. */
    children: React.ReactElement<DynamicPopoverButtonProps>;
    /** A react node that has includes the styling and content of the popover. */
    popover: React.ReactNode;
    /** The side and alignment of the popover in relation to the button. */
    placement?: DynamicPopoverPlacement;
    /** The number of pixels between the button and the popover */
    offset?: number;
    /** If shift is true, sets the minimum number of pixels between the popover and the viewport */
    padding?: number;
    /** If true, will flip the popover to the opposite side if there is not enough space. */
    flip?: boolean;
    /** If true, will shift the popover alignment to be remain visible. */
    shift?: boolean;
    /** If true, will prevent the popover from appearing */
    disabled?: boolean;
    /** If true, will display the popover */
    open?: boolean;
    /** The setter for the isOpen variable */
    onDismiss?: () => void;
    /** A function that returns string of the css state for open and closed popover. */
    animationFn?: DynamicPopoverAnimationFunc;
}
export declare const computeCoordsFromPlacement: (reference: DOMRect, floating: DOMRect, placement: DynamicPopoverPlacement, padding: number, offset: number, flip?: boolean, shift?: boolean) => {
    x: number;
    y: number;
    side: DynamicPopoverSide;
};
export declare const DynamicPopover: {
    ({ popover, children, placement, offset, padding, flip, shift, animationFn, disabled, open, onDismiss, }: DynamicPopoverProps): JSX.Element;
    displayName: string;
};
