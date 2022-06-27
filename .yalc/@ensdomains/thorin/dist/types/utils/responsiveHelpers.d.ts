import { css } from 'styled-components';
declare type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
declare type BreakpointType = 'min' | 'max';
declare type MediaQuery = (args: ReturnType<typeof css>) => ReturnType<typeof css>;
export declare const mq: Record<Breakpoint, Record<BreakpointType, MediaQuery>>;
export {};
