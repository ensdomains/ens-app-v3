export declare type Font = 'mono' | 'sans';
export declare type FontSize = 'headingOne' | 'headingTwo' | 'headingThree' | 'headingFour' | 'extraLarge' | 'large' | 'body' | 'small' | 'extraSmall';
export declare type FontWeight = 'light' | 'normal' | 'bold' | 'extraBold';
export declare const fonts: {
    [key in Font]: string;
};
export declare const fontSizes: {
    [key in FontSize]: string;
};
export declare const fontWeights: {
    [key in FontWeight]: string;
};
export declare const letterSpacings: {
    '-0.02': string;
    '-0.015': string;
    '-0.01': string;
    normal: string;
    '0.03': string;
};
export declare const lineHeights: {
    [key in FontSize]: string;
};
