export declare const fonts: {
    readonly mono: "\"iAWriter Mono\", Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace";
    readonly sans: "\"Satoshi\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif";
};
export type Font = keyof typeof fonts;
export declare const fontSizes: {
    readonly headingOne: "2.25rem";
    readonly headingTwo: "1.875rem";
    readonly headingThree: "1.625rem";
    readonly headingFour: "1.375rem";
    readonly extraLarge: "1.25rem";
    readonly large: "1.125rem";
    readonly body: "1rem";
    readonly small: "0.875rem";
    readonly extraSmall: "0.75rem";
};
export type FontSize = keyof typeof fontSizes;
export declare const fontWeights: {
    readonly light: "300";
    readonly normal: "500";
    readonly bold: "700";
    readonly extraBold: "830";
};
export type FontWeight = keyof typeof fontWeights;
export declare const letterSpacings: {
    readonly '-0.02': "-0.02em";
    readonly '-0.015': "-0.015em";
    readonly '-0.01': "-0.01em";
    readonly normal: "0";
    readonly '0.03': "0.03em";
};
export type LetterSapcing = keyof typeof letterSpacings;
export declare const lineHeights: {
    readonly headingOne: "3rem";
    readonly headingTwo: "2.5rem";
    readonly headingThree: "2.125rem";
    readonly headingFour: "1.875rem";
    readonly extraLarge: "1.625rem";
    readonly large: "1.5rem";
    readonly body: "1.25rem";
    readonly small: "1.25rem";
    readonly extraSmall: "1rem";
};
export type LineHeight = keyof typeof lineHeights;
