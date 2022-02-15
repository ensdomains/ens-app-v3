import { BoxProps } from '../../..';
import { OptionalTitle } from '../../types';
declare type Props = {
    className?: BoxProps['className'];
    color?: BoxProps['color'];
    size?: BoxProps['height'];
    strokeWidth?: BoxProps['strokeWidth'];
} & OptionalTitle;
export declare const IconSearch: ({ color, size, strokeWidth, ...props }: Props) => JSX.Element;
export {};
