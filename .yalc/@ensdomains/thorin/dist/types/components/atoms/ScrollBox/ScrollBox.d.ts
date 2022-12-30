import * as React from 'react';
declare type Props = {
    hideDividers?: boolean | {
        top?: boolean;
        bottom?: boolean;
    };
    topTriggerPx?: number;
    bottomTriggerPx?: number;
    onReachedTop?: () => void;
    onReachedBottom?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;
export declare const ScrollBox: ({ hideDividers, topTriggerPx, bottomTriggerPx, onReachedTop, onReachedBottom, children, ...props }: Props) => JSX.Element;
export {};
