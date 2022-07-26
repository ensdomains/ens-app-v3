export declare type DecodedContentHash = {
    protocolType?: any;
    decoded?: any;
    error?: any;
};
export declare function decodeContenthash(encoded: any): {
    protocolType?: undefined;
    decoded?: undefined;
    error?: undefined;
} | {
    protocolType: null;
    decoded: any;
    error?: undefined;
} | {
    protocolType: string | undefined;
    decoded: any;
    error: any;
};
export declare function validateContent(encoded: any): any;
export declare function isValidContenthash(encoded: any): boolean | undefined;
export declare function getProtocolType(encoded: any): {
    protocolType: string | undefined;
    decoded: string | undefined;
} | undefined;
export declare function encodeContenthash(text: string): {
    encoded: string | boolean;
    error: string | undefined;
};
