import type { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, ethers, PopulatedTransaction } from 'ethers';
import { getContractAddress as _getContractAddress } from './contracts/getContractAddress';
import ContractManager from './contracts/index';
import { SupportedNetworkId } from './contracts/types';
import type burnFuses from './functions/burnFuses';
import type commitName from './functions/commitName';
import type createSubname from './functions/createSubname';
import type deleteSubname from './functions/deleteSubname';
import type registerName from './functions/registerName';
import type { default as renewNames, renewNameWithData } from './functions/renewNames';
import type setName from './functions/setName';
import type setRecord from './functions/setRecord';
import type setRecords from './functions/setRecords';
import type setResolver from './functions/setResolver';
import type transferController from './functions/transferController';
import type transferName from './functions/transferName';
import type transferSubname from './functions/transferSubname';
import type unwrapName from './functions/unwrapName';
import type wrapName from './functions/wrapName';
import GqlManager from './GqlManager';
export type { Fuse, FuseArrayPossibilities, FuseObj, NamedFusesToBurn, UnnamedFuseType, UnnamedFuseValues, } from './utils/fuses';
declare type ENSOptions = {
    graphURI?: string | null;
    getContractAddress?: typeof _getContractAddress;
};
export declare type InternalENS = {
    options?: ENSOptions;
    provider?: ethers.providers.Provider;
    signer: JsonRpcSigner;
    graphURI?: string | null;
} & ENS;
export declare type ENSArgs<K extends keyof InternalENS> = {
    [P in K]: InternalENS[P];
};
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
declare type OmitFirstTwoArgs<F> = F extends (x: any, y: any, ...args: infer P) => infer R ? (...args: P) => R : never;
declare type WriteOptions = {
    addressOrIndex?: string | number;
    signer?: JsonRpcSigner;
};
declare type OptionalWriteOptions<F> = F extends (x: any, arg_0: infer Z, options?: infer P) => infer R ? (name: Z, options?: P & WriteOptions) => R : F extends (x: any, arg_0: infer Z, options: infer P) => infer R ? (name: Z, options: P & WriteOptions) => R : never;
interface WriteFunction<F extends (...args: any) => any> extends Function {
    (...args: Parameters<OptionalWriteOptions<F>>): Promise<ContractTransaction & {
        customData?: Record<string, any>;
    }>;
    populateTransaction: (...args: Parameters<OptionalWriteOptions<F>>) => Promise<PopulatedTransaction>;
}
export declare type RawFunction = {
    raw: (...args: any[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: (...args: any[]) => Promise<any>;
};
export declare type BatchFunctionResult<F extends RawFunction> = {
    args: Parameters<OmitFirstArg<F['raw']>>;
    raw: F['raw'];
    decode: F['decode'];
};
declare type BatchFunction<F extends RawFunction> = (...args: Parameters<OmitFirstArg<F['raw']>>) => BatchFunctionResult<F>;
export declare type RawFunctionWithBatch = {
    batch: BatchFunction<any>;
} & RawFunction;
interface GeneratedRawFunction<F extends RawFunction> extends Function, RawFunction {
    (...args: Parameters<OmitFirstArg<F['raw']>>): ReturnType<OmitFirstTwoArgs<F['decode']>>;
    batch: BatchFunction<F>;
}
export interface GenericGeneratedRawFunction extends Function, RawFunctionWithBatch {
}
export declare class ENS {
    [x: string]: any;
    protected options?: ENSOptions;
    protected provider?: ethers.providers.JsonRpcProvider;
    protected graphURI?: string | null;
    protected initialProvider?: ethers.providers.JsonRpcProvider;
    contracts?: ContractManager;
    getContractAddress: (networkId: SupportedNetworkId) => import("./contracts/getContractAddress").ContractAddressFetch;
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
     * Generates a write wrapped function
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {OmitFirstArg} - The generated wrapped function
     */
    private generateWriteFunction;
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
    batch: GeneratedRawFunction<{
        raw: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, ...items: BatchFunctionResult<RawFunction>[]) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ multicallWrapper }: ENSArgs<"multicallWrapper">, data: string, ...items: BatchFunctionResult<RawFunction>[]) => Promise<any[] | undefined>;
    }>;
    getProfile: (nameOrAddress: string, options?: ({
        contentHash?: boolean | undefined;
        texts?: boolean | string[] | undefined;
        coinTypes?: boolean | string[] | undefined;
    } & {
        resolverAddress?: string | undefined;
        fallback?: {
            contentHash?: boolean | undefined;
            texts?: string[] | undefined;
            coinTypes?: string[] | undefined;
        } | undefined;
    }) | undefined) => Promise<{
        isMigrated: boolean | null;
        createdAt: string | null;
        address?: string | undefined;
        name?: string | null | undefined;
        match?: boolean | undefined;
        message?: string | undefined;
        records?: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            texts?: {
                key: string | number;
                type: "addr" | "text" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            coinTypes?: {
                key: string | number;
                type: "addr" | "text" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        } | undefined;
        resolverAddress?: string | undefined;
        reverseResolverAddress?: string | undefined;
    } | undefined>;
    getRecords: (name: string, options?: {
        contentHash?: boolean | undefined;
        texts?: boolean | string[] | undefined;
        coinTypes?: boolean | string[] | undefined;
        resolverAddress?: string | undefined;
    } | undefined) => Promise<{
        isMigrated: boolean | null;
        createdAt: string | null;
        address?: string | undefined;
        name?: string | null | undefined;
        match?: boolean | undefined;
        message?: string | undefined;
        records?: {
            contentHash?: string | import("./utils/contentHash").DecodedContentHash | null | undefined;
            texts?: {
                key: string | number;
                type: "addr" | "text" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
            coinTypes?: {
                key: string | number;
                type: "addr" | "text" | "contentHash";
                coin?: string | undefined;
                value: string;
            }[] | undefined;
        } | undefined;
        resolverAddress?: string | undefined;
        reverseResolverAddress?: string | undefined;
    } | undefined>;
    getName: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, address: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string, address: string) => Promise<{
            name: any;
            match: boolean;
            reverseResolverAddress: any;
            resolverAddress: any;
        } | {
            name: undefined;
            match?: undefined;
            reverseResolverAddress?: undefined;
            resolverAddress?: undefined;
        } | undefined>;
    }>;
    getResolver: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<any>;
    }>;
    getWrapperData: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
            fuseObj: import("./utils/fuses").CurrentFuses;
            expiryDate: Date;
            rawFuses: ethers.BigNumber;
            owner: any;
        } | undefined>;
    }>;
    getHistory: (name: string) => Promise<{
        domain: {
            type: "Transfer" | "NewOwner" | "NewResolver" | "NewTTL";
            blockNumber: number;
            transactionHash: string;
            id: string;
            data: object;
        }[];
        registration: {
            type: "NameRegistered" | "NameRenewed" | "NameTransferred";
            blockNumber: number;
            transactionHash: string;
            id: string;
            data: object;
        }[];
        resolver: {
            type: "AddrChanged" | "ContenthashChanged" | "InterfaceChanged" | "NameChanged" | "PubkeyChanged" | "TextChanged" | "MulticoinAddrChanged" | "AbiChanged" | "AuthorisationChanged";
            blockNumber: number;
            transactionHash: string;
            id: string;
            data: object;
        }[];
    } | undefined>;
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
        } | undefined>;
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
        } | undefined>;
    }>;
    getAddr: GeneratedRawFunction<{
        raw: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, name: string, coinType?: string | number | undefined) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, universalWrapper }: ENSArgs<"contracts" | "universalWrapper">, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
            coin: string;
            addr: string;
        } | undefined>;
    }>;
    _getAddr: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string, coinType?: string | number | undefined, bypassFormat?: boolean | undefined) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string, _name: string, coinType?: string | number | undefined) => Promise<string | {
            coin: string;
            addr: string;
        } | undefined>;
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
    getOwner: GeneratedRawFunction<{
        raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string, contract?: "nameWrapper" | "registrar" | "registry" | undefined) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, name: string, contract?: "nameWrapper" | "registrar" | "registry" | undefined) => Promise<{
            registrant?: string | undefined;
            owner?: string | undefined;
            ownershipLevel: "nameWrapper" | "registrar" | "registry";
        } | undefined>;
    }>;
    getExpiry: GeneratedRawFunction<{
        raw: (ensArgs: ENSArgs<"contracts" | "multicallWrapper">, name: string, { contract }?: {
            contract?: ("nameWrapper" | "registrar") | undefined;
        }) => Promise<{
            to: string;
            data: string;
        }>;
        decode: (ensArgs: ENSArgs<"contracts" | "multicallWrapper">, data: string, name: string, { contract }?: {
            contract?: ("nameWrapper" | "registrar") | undefined;
        }) => Promise<{
            expiry: Date;
            gracePeriod: null;
        } | {
            expiry: Date | null;
            gracePeriod: number;
        } | undefined>;
    }>;
    getSubnames: (functionArgs: {
        name: string;
        page?: number | undefined;
        pageSize?: number | undefined;
        orderDirection?: "asc" | "desc" | undefined;
        orderBy?: "labelName" | "createdAt" | undefined;
        lastSubnames?: any[] | undefined;
        search?: string | undefined;
    }) => Promise<{
        subnames: {
            id: string;
            labelName: string | null;
            truncatedName?: string | undefined;
            labelhash: string;
            isMigrated: boolean;
            name: string;
            owner: {
                id: string;
            };
        }[];
        subnameCount: number;
    }>;
    getNames: (args_0: {
        address: string;
        type: "owner" | "registrant" | "all";
        page?: number | undefined;
        pageSize?: number | undefined;
        orderDirection?: "asc" | "desc" | undefined;
    } & ({
        type: "registrant";
        orderBy?: "expiryDate" | "registrationDate" | "labelName" | undefined;
    } | {
        type: "owner";
        orderBy?: "labelName" | "createdAt" | undefined;
    } | {
        type: "all";
        orderBy?: "labelName" | "creationDate" | undefined;
        page?: undefined;
        pageSize?: undefined;
    })) => Promise<import("./functions/getNames").Name[]>;
    getPrice: GeneratedRawFunction<{
        raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, nameOrNames: string | string[], duration: number, legacy?: boolean | undefined) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, _nameOrNames: string | string[], _duration: number, legacy?: boolean | undefined) => Promise<{
            base: ethers.BigNumber;
            premium: ethers.BigNumber;
        } | undefined>;
    }>;
    getDNSOwner: (dnsName: string) => Promise<any>;
    universalWrapper: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, name: string, data: string) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
            data: any;
            resolver: any;
        } | undefined>;
    }>;
    resolverMulticallWrapper: GeneratedRawFunction<{
        raw: ({ contracts }: ENSArgs<"contracts">, data: {
            to: string;
            data: string;
        }[]) => Promise<{
            to: string;
            data: string;
        }>;
        decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<ethers.utils.Result | undefined>;
    }>;
    multicallWrapper: GeneratedRawFunction<{
        raw({ contracts }: ENSArgs<"contracts">, transactions: ethers.providers.TransactionRequest[], requireSuccess?: boolean): Promise<{
            to: string;
            data: string;
        }>;
        decode({ contracts, provider }: ENSArgs<"provider" | "contracts">, data: string, transactions: ethers.providers.TransactionRequest[]): Promise<{
            success: boolean;
            returnData: string;
            0: boolean;
            1: string;
            length: 2;
            toString(): string;
            toLocaleString(): string;
            pop(): string | boolean | undefined;
            push(...items: (string | boolean)[]): number;
            concat(...items: ConcatArray<string | boolean>[]): (string | boolean)[];
            concat(...items: (string | boolean | ConcatArray<string | boolean>)[]): (string | boolean)[];
            join(separator?: string | undefined): string;
            reverse(): (string | boolean)[];
            shift(): string | boolean | undefined;
            slice(start?: number | undefined, end?: number | undefined): (string | boolean)[];
            sort(compareFn?: ((a: string | boolean, b: string | boolean) => number) | undefined): [boolean, string];
            splice(start: number, deleteCount?: number | undefined): (string | boolean)[];
            splice(start: number, deleteCount: number, ...items: (string | boolean)[]): (string | boolean)[];
            unshift(...items: (string | boolean)[]): number;
            indexOf(searchElement: string | boolean, fromIndex?: number | undefined): number;
            lastIndexOf(searchElement: string | boolean, fromIndex?: number | undefined): number;
            every<S extends string | boolean>(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => value is S, thisArg?: any): this is S[];
            every(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): boolean;
            some(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): boolean;
            forEach(callbackfn: (value: string | boolean, index: number, array: (string | boolean)[]) => void, thisArg?: any): void;
            map<U>(callbackfn: (value: string | boolean, index: number, array: (string | boolean)[]) => U, thisArg?: any): U[];
            filter<S_1 extends string | boolean>(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => value is S_1, thisArg?: any): S_1[];
            filter(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): (string | boolean)[];
            reduce(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean): string | boolean;
            reduce(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean, initialValue: string | boolean): string | boolean;
            reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => U_1, initialValue: U_1): U_1;
            reduceRight(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean): string | boolean;
            reduceRight(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean, initialValue: string | boolean): string | boolean;
            reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => U_2, initialValue: U_2): U_2;
            find<S_2 extends string | boolean>(predicate: (this: void, value: string | boolean, index: number, obj: (string | boolean)[]) => value is S_2, thisArg?: any): S_2 | undefined;
            find(predicate: (value: string | boolean, index: number, obj: (string | boolean)[]) => unknown, thisArg?: any): string | boolean | undefined;
            findIndex(predicate: (value: string | boolean, index: number, obj: (string | boolean)[]) => unknown, thisArg?: any): number;
            fill(value: string | boolean, start?: number | undefined, end?: number | undefined): [boolean, string];
            copyWithin(target: number, start: number, end?: number | undefined): [boolean, string];
            entries(): IterableIterator<[number, string | boolean]>;
            keys(): IterableIterator<number>;
            values(): IterableIterator<string | boolean>;
            includes(searchElement: string | boolean, fromIndex?: number | undefined): boolean;
            flatMap<U_3, This = undefined>(callback: (this: This, value: string | boolean, index: number, array: (string | boolean)[]) => U_3 | readonly U_3[], thisArg?: This | undefined): U_3[];
            flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
            [Symbol.iterator](): IterableIterator<string | boolean>;
            [Symbol.unscopables](): {
                copyWithin: boolean;
                entries: boolean;
                fill: boolean;
                find: boolean;
                findIndex: boolean;
                keys: boolean;
                values: boolean;
            };
            at(index: number): string | boolean | undefined;
        }[] | undefined>;
    }>;
    setName: WriteFunction<typeof setName>;
    setRecords: WriteFunction<typeof setRecords>;
    setRecord: WriteFunction<typeof setRecord>;
    setResolver: WriteFunction<typeof setResolver>;
    transferName: WriteFunction<typeof transferName>;
    transferController: WriteFunction<typeof transferController>;
    wrapName: WriteFunction<typeof wrapName>;
    unwrapName: WriteFunction<typeof unwrapName>;
    burnFuses: WriteFunction<typeof burnFuses>;
    createSubname: WriteFunction<typeof createSubname>;
    deleteSubname: WriteFunction<typeof deleteSubname>;
    transferSubname: WriteFunction<typeof transferSubname>;
    commitName: WriteFunction<typeof commitName>;
    registerName: WriteFunction<typeof registerName>;
    renewNames: WriteFunction<typeof renewNames>;
    renewNameWithData: WriteFunction<typeof renewNameWithData>;
}
