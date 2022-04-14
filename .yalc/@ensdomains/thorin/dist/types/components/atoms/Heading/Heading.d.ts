import * as React from 'react';
declare type Props = {
    align?: React.CSSProperties['textAlign'];
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'legend';
    children?: React.ReactNode;
    color?: string;
    id?: string;
    transform?: React.CSSProperties['textTransform'];
    responsive?: boolean;
    level?: '1' | '2';
};
export declare const Heading: ({ align, children, as, id, level, responsive, transform, }: Props) => JSX.Element;
export {};
