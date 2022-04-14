import { FlattenSimpleInterpolation } from 'styled-components';
declare type Breakpoints = {
    sm: (...args: any[]) => FlattenSimpleInterpolation;
    md: (...args: any[]) => FlattenSimpleInterpolation;
    lg: (...args: any[]) => FlattenSimpleInterpolation;
    xl: (...args: any[]) => FlattenSimpleInterpolation;
};
export declare const largerThan: Breakpoints;
export {};
