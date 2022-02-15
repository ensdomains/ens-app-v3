import { OptionalResponsiveObject, OptionalResponsiveValue } from '../../../css';
export declare type Direction = 'horizontal' | 'vertical';
export declare const directionToFlexDirection: (direction: OptionalResponsiveValue<Direction> | undefined) => "column" | "row" | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", "column" | "row">> | undefined;
export declare const wrapToFlexWrap: (wrap: OptionalResponsiveObject<true | false> | undefined) => "nowrap" | "wrap" | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", "nowrap" | "wrap">> | undefined;
