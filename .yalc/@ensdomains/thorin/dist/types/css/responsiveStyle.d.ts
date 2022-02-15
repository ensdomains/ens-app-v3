import { StyleRule } from '@vanilla-extract/css';
declare type CSSProps = Omit<StyleRule, '@media' | '@supports'>;
declare type ResponsiveStyle = {
    xs?: CSSProps;
    sm?: CSSProps;
    md?: CSSProps;
    lg?: CSSProps;
    xl?: CSSProps;
};
export declare const responsiveStyle: ({ xs, sm, md, lg, xl, }: ResponsiveStyle) => StyleRule;
export {};
