import type { DynamicPopoverSide } from '../../../../components/atoms/DynamicPopover';
type Properties = {
    display: string;
    alignItems: string;
    top: string;
    left: string;
    right: string;
    bottom: string;
    margin: string;
    borderTopColorFunction: (color: string) => string;
    borderRightColorFunction: (color: string) => string;
    borderBottomColorFunction: (color: string) => string;
    borderLeftColorFunction: (color: string) => string;
};
export declare const getValueForPlacement: <T extends keyof Properties>(placement: DynamicPopoverSide, property: T) => Properties[T];
export {};
