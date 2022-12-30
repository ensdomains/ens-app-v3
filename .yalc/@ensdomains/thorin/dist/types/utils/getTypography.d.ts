import { DefaultTheme, WithTypography } from '../types';
declare type TypographyFunc = (theme: DefaultTheme, typography?: WithTypography['typography'], field?: 'fontSize' | 'lineHeight' | 'fontWeight') => string;
export declare const getTypography: TypographyFunc;
export {};
