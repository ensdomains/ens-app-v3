import * as React from 'react';
declare type Props = {
    /** An alternative element type to render the component as.*/
    as?: 'span';
    /** If true, hides the content and shows the skeleton style. */
    loading?: boolean;
};
export declare const Skeleton: {
    ({ as, children, loading, }: React.PropsWithChildren<Props>): JSX.Element;
    displayName: string;
};
export {};
