import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
type Props = {
    children: ReactNodeNoStrings;
    loading?: boolean;
};
export declare const Context: React.Context<boolean | undefined>;
export declare const SkeletonGroup: {
    ({ children, loading }: Props): JSX.Element;
    displayName: string;
};
export {};
