import type { StyledComponent, DefaultTheme } from 'styled-components';
import * as React from 'react';
export declare type Props = {
    title?: string;
} & NativeDivProps;
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Card: {
    ({ title, children, ...props }: Props): JSX.Element;
    displayName: string;
    Divider: StyledComponent<"div", DefaultTheme, {}, never>;
};
export {};
