import { ethers } from 'ethers';
import ContractManager from './contracts';
import GqlManager from './GqlManager';
declare type ENSOptions = {
    graphURI?: string | null;
};
export declare type InternalENS = {
    options?: ENSOptions;
    provider?: ethers.providers.Provider;
    graphURI?: string | null;
} & ENS;
export declare type ENSArgs<K extends keyof InternalENS> = {
    [P in K]: InternalENS[P];
};
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
declare type OmitFirstTwoArgs<F> = F extends (x: any, y: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export declare type RawFunction = {
    raw: (...args: any[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: (...args: any[]) => Promise<any>;
};
interface GeneratedRawFunction<F extends RawFunction> extends Function, RawFunction {
    (...args: Parameters<OmitFirstArg<F['raw']>>): ReturnType<OmitFirstTwoArgs<F['decode']>>;
}
export interface GenericGeneratedRawFunction extends Function, RawFunction {
}
export declare class ENS {
    [x: string]: any;
    protected options?: ENSOptions;
    protected provider?: ethers.providers.JsonRpcProvider;
    protected graphURI?: string | null;
    protected initialProvider?: ethers.providers.JsonRpcProvider;
    contracts?: ContractManager;
    gqlInstance: GqlManager;
    constructor(options?: ENSOptions);
    /**
     * Checks for an initial provider and if it exists, sets it as the provider
     * @returns {Promise<void>} - A promise that resolves when the provider is checked, and set if needed
     */
    private checkInitialProvider;
    /**
     * Creates an object of ENS properties from an array
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @returns {Object} - An object of ENS properties
     */
    private forwardDependenciesFromArray;
    /**
     * Creates a wrapper for a function to be dynamically imported, with the correct dependencies passed in
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @param {string} subFunc - The type of function being imported
     * @returns {Function} - The generated wrapped function
     */
    private importGenerator;
    /**
     * Generates a normal wrapped function
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {OmitFirstArg} - The generated wrapped function
     */
    private generateFunction;
    /**
     * Generates a wrapped function from raw and decode exports
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {GeneratedRawFunction} - The generated wrapped function
     */
    private generateRawFunction;
    /**
     * Sets the provider for the ENS class
     * @param {ethers.providers.JsonRpcProvider} provider - The provider to set
     * @returns {Promise<void>} - A promise that resolves when the provider is set
     */
    setProvider: (provider: ethers.providers.JsonRpcProvider) => Promise<void>;
    /**
     * Creates a new ENS instance with a different provider, ideally should be used individually with any given function
     * @param {ethers.providers.JsonRpcProvider} provider - The provider to use
     * @returns {ENS} - A new ENS instance with the given provider
     */
    withProvider: (provider: ethers.providers.JsonRpcProvider) => ENS;
    batch: (...args: [GenericGeneratedRawFunction, ...any[]][]) => Promise<any[]>;
    _batch: (transactions: ethers.providers.TransactionRequest[], requireSuccess?: boolean | undefined) => Promise<import("./generated/Multicall").Multicall3.ResultStructOutput[]>;
    getProfile: (nameOrAddress: string, options?: {
        contentHash?: boolean | undefined;
        texts?: boolean | string[] | undefined;
        coinTypes?: boolean | string[] | undefined;
    } | undefined) => Promise<{
        address: any;
        records: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            coinTypes?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            texts?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        };
        resolverAddress: any;
    } | {
        name: any;
        records: null;
        match: boolean;
        resolverAddress?: undefined;
    } | {
        name: any;
        records: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            coinTypes?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            texts?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        };
        match: boolean;
        resolverAddress: any;
    } | null>;
    getRecords: (name: string, options?: {
        contentHash?: boolean | undefined;
        texts?: boolean | string[] | undefined;
        coinTypes?: boolean | string[] | undefined;
    } | undefined) => Promise<{
        address: any;
        records: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            coinTypes?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            texts?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        };
        resolverAddress: any;
    } | {
        name: any;
        records: null;
        match: boolean;
        resolverAddress?: undefined;
    } | {
        name: any;
        records: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            coinTypes?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            texts?: {
                key: string | number;
                type: "text" | "addr" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        };
        match: boolean;
        resolverAddress: any;
    } | null>;
    getName: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, address: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string, address: string) => Promise<{
            name: any;
            match: boolean;
        } | null>;
    }>;
    getResolver: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<any>;
    }>;
    getFuses: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string, name: string) => Promise<{
            fuseObj: {
                [k: string]: any;
            };
            vulnerability: any;
            vulnerableNode: null;
            rawFuses: ethers.BigNumber;
        } | null>;
    }>;
    getHistory: (name: string) => Promise<{
        domain: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
        registration: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
        resolver: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
    } | null>;
    getHistoryWithDetail: (name: string) => Promise<{
        domain: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
        registration: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
        resolver: {
            type: any;
            blockNumber: any;
            transactionHash: any;
            id: any;
            data: Record<string, any>;
        }[];
    } | null>;
    getHistoryDetailForTransactionHash: (hash: string, indexInTransaction?: number | undefined) => Promise<({
        key: any;
        value: any;
    } | null)[] | {
        key: any;
        value: any;
    } | null>;
    getContentHash: GeneratedRawFunction<{
        raw: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, data: string) => Promise<{
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
        } | null>;
    }>;
    _getContentHash: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
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
        } | null>;
    }>;
    getAddr: GeneratedRawFunction<{
        raw: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, name: string, coinType?: string | number | undefined) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
            coin: string;
            addr: string;
        } | null>;
    }>;
    _getAddr: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string, coinType?: string | number | undefined, bypassFormat?: boolean | undefined) => Promise<{
            to: string;
            data: string; /**
             * Creates an object of ENS properties from an array
             * @param {FunctionDeps} dependencies - An array of ENS properties
             * @returns {Object} - An object of ENS properties
             */
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
            coin: string;
            addr: string;
        } | null>;
    }>;
    getText: GeneratedRawFunction<{
        raw: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, name: string, key: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, data: string) => Promise<any>;
    }>;
    _getText: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string, key: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<any>;
    }>;
    _getOwner: (name: string) => Promise<{
        owner: any;
        ownershipLevel: string;
        registrant?: undefined;
    } | {
        registrant: any;
        owner: any;
        ownershipLevel: string;
    } | null>;
    getOwner: (name: string) => Promise<{
        owner: any;
        ownershipLevel: string;
        registrant?: undefined;
    } | {
        registrant: any;
        owner: any;
        ownershipLevel: string;
    } | null>;
    universalWrapper: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string, data: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
            data: any;
            resolver: any;
        } | null>;
    }>;
    resolverMulticallWrapper: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, data: {
            to: string;
            data: string;
        }[]) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<ethers.utils.Result | null>;
    }>;
    setName: (name: string) => Promise<ethers.ContractTransaction | undefined>;
    setRecords: (name: string, records: {
        contentHash?: string | undefined;
        texts?: {
            key: string;
            value: string;
        }[] | undefined;
        coinTypes?: {
            key: string;
            value: string;
        }[] | undefined;
    }) => Promise<ethers.ContractTransaction | undefined>;
    setResolver: (name: string, contract: "registry" | "nameWrapper", resolver?: string | undefined, options?: {
        addressOrIndex?: string | number | undefined;
    } | undefined) => Promise<ethers.ContractTransaction>;
    transferName: (name: string, newOwner: string, contract: "registry" | "nameWrapper" | "baseRegistrar", options?: {
        addressOrIndex?: string | number | undefined;
    } | undefined) => Promise<ethers.ContractTransaction>;
    wrapName: (name: string, wrappedOwner: string, fuseOptions?: string | number | import("./@types/FuseOptions").FuseOptions | undefined, resolverAddress?: string | undefined, options?: {
        addressOrIndex?: string | number | undefined;
    } | undefined) => Promise<ethers.ContractTransaction>;
    unwrapName: (name: string, newController: string, newRegistrant?: string | undefined, options?: {
        addressOrIndex?: string | number | undefined;
    } | undefined) => Promise<ethers.ContractTransaction>;
    burnFuses: (name: string, fusesToBurn: import("./@types/FuseOptions").FuseOptions) => Promise<ethers.ContractTransaction>;
    createSubname: (args_0: {
        name: string;
        owner: string;
        resolverAddress?: string | undefined;
        contract: "registry" | "nameWrapper";
        options?: {
            addressOrIndex?: string | number | undefined;
        } | undefined;
    } | ({
        contract: "nameWrapper";
        fuses?: import("./@types/FuseOptions").FuseOptions | undefined;
        shouldWrap?: boolean | undefined;
    } & {
        name: string;
        owner: string;
        resolverAddress?: string | undefined;
        contract: "registry" | "nameWrapper";
        options?: {
            addressOrIndex?: string | number | undefined;
        } | undefined;
    })) => Promise<ethers.ContractTransaction>;
    deleteSubname: (name: string, contract: "registry" | "nameWrapper", options?: {
        addressOrIndex?: string | number | undefined;
    } | undefined) => Promise<ethers.ContractTransaction>;
}
export {};
