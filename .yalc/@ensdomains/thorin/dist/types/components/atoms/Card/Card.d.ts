import * as React from 'react';
export declare type Props = {
    /** Adds shadow when theme is in light mode.  */
    shadow?: boolean;
};
export declare const Card: {
    ({ children, shadow }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
