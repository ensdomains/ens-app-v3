import type { StyledComponent, DefaultTheme } from 'styled-components';
import * as React from 'react';
export type Props = {
    title?: string;
} & NativeDivProps;
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare const Card: {
    ({ title, children, ...props }: Props): JSX.Element;
    displayName: string;
    Divider: StyledComponent<"div", DefaultTheme, {}, never>;
};
export {};
