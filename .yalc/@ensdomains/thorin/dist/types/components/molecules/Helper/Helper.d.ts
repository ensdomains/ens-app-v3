import * as React from 'react';
import type { Alert } from '../../../types';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type Alignment = 'horizontal' | 'vertical';
export type Props = NativeDivProps & {
    alert?: Alert;
    alignment?: Alignment;
    children: React.ReactNode;
};
export declare const Helper: {
    ({ alert, alignment, children, ...props }: Props): React.JSX.Element;
    displayName: string;
};
export {};
