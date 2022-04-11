import * as React from 'react';
import { Colors, Radii } from '@/src/tokens';
declare type Props = {
    as?: 'div' | 'span';
    backgroundColor?: Colors;
    radius?: Radii;
    loading?: boolean;
};
export declare const Skeleton: ({ as, children, loading, }: React.PropsWithChildren<Props>) => JSX.Element;
export {};
