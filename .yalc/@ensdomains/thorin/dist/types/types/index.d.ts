import * as React from 'react';
export declare type AllOrNone<T> = T | {
    [K in keyof T]?: never;
};
export declare type ReactNodeNoStrings = React.ReactElement | React.ReactNodeArray | boolean | null | undefined;
export declare type EmptyObject = {
    [k: string]: unknown;
};
