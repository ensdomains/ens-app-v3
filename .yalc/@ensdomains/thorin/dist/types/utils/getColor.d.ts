import { DefaultTheme, WithColor } from '../types/index';
declare type ColorType = 'text' | 'background' | 'border' | 'hover' | 'hoverFilter' | 'active';
declare type ColorFunc = (theme: DefaultTheme, scheme?: WithColor['colorScheme'], color?: WithColor['color'], type?: ColorType) => string;
declare type PresetColorFunc = (theme: DefaultTheme, preset: 'disabled', type?: ColorType) => string;
export declare const getColor: ColorFunc;
/** Current preset is only disabled */
export declare const getPresetColor: PresetColorFunc;
export {};
