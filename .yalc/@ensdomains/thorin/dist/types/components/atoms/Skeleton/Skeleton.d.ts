import * as React from 'react';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {
    /** An alternative element type to render the component as.*/
    as?: 'span';
    /** If true, hides the content and shows the skeleton style. */
    loading?: boolean;
} & NativeDivProps;
export declare const Skeleton: {
    ({ as, children, loading, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
