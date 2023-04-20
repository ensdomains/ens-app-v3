import * as React from 'react';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Size = 'small' | 'medium';
type Props = {
    /** Total number of pages */
    total: number;
    current: number;
    /** Maximum number of buttons to show */
    max?: number;
    size?: Size;
    alwaysShowFirst?: boolean;
    alwaysShowLast?: boolean;
    showEllipsis?: boolean;
    onChange: (value: number) => void;
} & Omit<NativeDivProps, 'children' | 'onChange'>;
export declare const PageButtons: ({ total, current, max, size, alwaysShowFirst, alwaysShowLast, showEllipsis, onChange, ...props }: Props) => JSX.Element;
export {};
