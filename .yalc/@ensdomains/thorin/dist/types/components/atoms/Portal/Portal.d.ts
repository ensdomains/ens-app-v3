import * as React from 'react';
type Props = {
    /** The classname attribute of the container element */
    className?: string;
    /** The element tag of the container element */
    el?: string;
    children: React.ReactNode;
    /** A callback fired on the render of children */
    renderCallback?: () => void;
};
export declare const Portal: React.FC<Props>;
export {};
