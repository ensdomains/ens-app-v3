import { FontSize } from '../../../../tokens/typography';
type LegacyFont = 'label' | 'labelHeading';
type HeadingFont = Extract<FontSize, 'headingOne' | 'headingTwo' | 'headingThree' | 'headingFour'>;
type VariableFont = Exclude<FontSize, 'headingOne' | 'headingTwo' | 'headingThree' | 'headingFour'>;
export type FontVariant = LegacyFont | HeadingFont | VariableFont | `${VariableFont}Bold`;
type Properties = {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
};
type Property = keyof Properties;
export declare const getValueForVariant: <T extends keyof Properties>(variant: FontVariant, property: Property) => Properties[T];
export {};
