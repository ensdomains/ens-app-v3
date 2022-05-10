import * as React from 'react';
export declare type Props = {
    as?: 'div' | 'span';
    label?: string;
    hover?: boolean;
    size?: 'small' | 'medium';
    tone?: 'accent' | 'blue' | 'green' | 'red' | 'secondary';
};
export declare const Tag: ({ as, children, hover, label, size, tone, }: React.PropsWithChildren<Props>) => JSX.Element;
