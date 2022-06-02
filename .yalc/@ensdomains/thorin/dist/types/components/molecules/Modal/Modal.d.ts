import * as React from 'react';
declare type Props = {
    children: React.ReactNode;
    /** An element providing styling for the backdrop component. Defaults to the BackdropSurface component. */
    backdropSurface?: React.ElementType;
    /** A handler for click events in the background. */
    onDismiss?: () => void;
    /** If true, the modal is visible. */
    open: boolean;
};
export declare const Modal: {
    ({ children, backdropSurface, onDismiss, open, }: Props): JSX.Element;
    displayName: string;
};
export {};
