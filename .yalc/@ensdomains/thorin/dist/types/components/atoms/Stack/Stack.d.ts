import * as React from 'react';
import { OptionalResponsiveObject, OptionalResponsiveValue } from '../../../css';
import { ReactNodeNoStrings } from '../../../types';
import { BoxProps } from '../Box';
import { Direction } from './utils';
export declare const validStackComponents: readonly ["a", "article", "div", "form", "header", "label", "li", "main", "section", "span"];
declare type Props = {
    as?: typeof validStackComponents[number];
    align?: BoxProps['alignItems'];
    children: ReactNodeNoStrings;
    direction?: OptionalResponsiveValue<Direction>;
    flex?: BoxProps['flex'];
    justify?: BoxProps['justifyContent'];
    space?: BoxProps['gap'];
    wrap?: OptionalResponsiveObject<true | false>;
};
export declare const Stack: ({ as, align, children, justify, flex, direction, space, wrap, }: React.PropsWithChildren<Props>) => JSX.Element;
export {};
