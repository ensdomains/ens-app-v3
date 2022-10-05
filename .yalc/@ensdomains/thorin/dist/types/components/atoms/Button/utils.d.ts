import { DefaultTheme } from '@/src/types';
export interface GetCenterProps {
    center: boolean | undefined;
    size: 'small' | 'medium' | 'extraSmall' | undefined;
    side: 'left' | 'right';
    theme: DefaultTheme;
}
export declare const getCenterProps: ({ center, size, side, theme }: GetCenterProps) => false | import("styled-components").FlattenSimpleInterpolation | undefined;
