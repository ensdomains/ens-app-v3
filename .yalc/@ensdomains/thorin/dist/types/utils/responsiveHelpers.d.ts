import { css } from 'styled-components';
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BreakpointType = 'min' | 'max';
type MediaQuery = (args: ReturnType<typeof css>) => ReturnType<typeof css>;
export declare const mq: Record<Breakpoint, Record<BreakpointType, MediaQuery>>;
export {};
