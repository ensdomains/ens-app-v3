import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Props = {
    total: number;
    current: number;
    max?: number;
    alwaysShowFirst?: boolean;
    alwaysShowLast?: boolean;
    onChange: (value: number) => void;
} & Omit<NativeDivProps, 'children' | 'onChange'>;
export declare const PageButtons: ({ total, current, max, alwaysShowFirst, alwaysShowLast, onChange, ...props }: Props) => JSX.Element;
export {};
