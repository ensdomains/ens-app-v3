import * as React from 'react';
declare type Props = {
    topTriggerPx?: number;
    bottomTriggerPx?: number;
    onReachedTop?: () => void;
    onReachedBottom?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;
export declare const ScrollBox: ({ topTriggerPx, bottomTriggerPx, onReachedTop, onReachedBottom, children, ...props }: Props) => JSX.Element;
export {};
