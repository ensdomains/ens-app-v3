import * as React from 'react';
import { BoxProps } from '../Box/Box';
type Props = {
    hideDividers?: boolean | {
        top?: boolean;
        bottom?: boolean;
    };
    topTriggerPx?: number;
    bottomTriggerPx?: number;
    onReachedTop?: () => void;
    onReachedBottom?: () => void;
} & BoxProps;
export declare const ScrollBox: ({ hideDividers, topTriggerPx, bottomTriggerPx, onReachedTop, onReachedBottom, children, ...props }: Props) => React.JSX.Element;
export {};
