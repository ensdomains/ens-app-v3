import * as React from 'react';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {
    children: NativeDivProps['children'];
    /** An element providing styling for the backdrop component. Defaults to the BackdropSurface component. */
    backdropSurface?: React.ElementType;
    /** A handler for click events in the background. */
    onDismiss?: () => void;
    /** If true, the modal is visible. */
    open: boolean;
    /** Aligns the modal to the top of the page. Only applies to mobile views. */
    alignTop?: boolean;
    /** A callback fired on the render of children */
    renderCallback?: () => void;
    /** if true, modal will remain centered to bottom of page */
    mobileOnly?: boolean;
} & NativeDivProps;
export declare const Modal: {
    ({ children, backdropSurface, onDismiss, open, alignTop, renderCallback, mobileOnly, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
