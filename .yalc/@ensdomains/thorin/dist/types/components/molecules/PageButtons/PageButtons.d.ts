import * as React from 'react';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type Props = {
    /** Total number of pages */
    total: number;
    current: number;
    /** Maximum number of buttons to show */
    max?: number;
    alwaysShowFirst?: boolean;
    alwaysShowLast?: boolean;
    onChange: (value: number) => void;
} & Omit<NativeDivProps, 'children' | 'onChange'>;
export declare const PageButtons: ({ total, current, max, alwaysShowFirst, alwaysShowLast, onChange, ...props }: Props) => JSX.Element;
export {};
