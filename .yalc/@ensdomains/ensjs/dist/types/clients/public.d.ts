import { type Client, type ClientConfig, type PublicRpcSchema, type Transport } from 'viem';
import type { ChainWithBaseContracts, ChainWithEns } from '../contracts/consts.js';
import type { Prettify } from '../types.js';
import { type EnsPublicActions } from './decorators/public.js';
import { type EnsSubgraphActions } from './decorators/subgraph.js';
export type EnsPublicClientConfig<TTransport extends Transport = Transport, TChain extends ChainWithBaseContracts = ChainWithBaseContracts> = Pick<ClientConfig<TTransport, TChain>, 'batch' | 'key' | 'name' | 'pollingInterval' | 'transport'> & {
    chain: TChain;
};
export type EnsPublicClient<TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns> = Prettify<Client<TTransport, TChain, undefined, PublicRpcSchema, EnsPublicActions & EnsSubgraphActions>>;
/**
 * Creates a ENS Public Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsPublicClientConfig}
 * @returns An ENS Public Client. {@link EnsPublicClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsPublicClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export declare const createEnsPublicClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts>({ batch, chain, key, name, transport, pollingInterval, }: EnsPublicClientConfig<TTransport, TChain>) => {
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: ChainWithEns<TChain>;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<PublicRpcSchema>;
    transport: ReturnType<TTransport>["config"] & ReturnType<TTransport>["value"];
    type: string;
    uid: string;
    ensBatch: <TBatchFunctions extends import("../public.js").BatchParameters>(...parameters: TBatchFunctions) => Promise<import("../public.js").BatchReturnType<TBatchFunctions>>;
    getAbiRecord: ({ name, gatewayUrls, strict, supportedContentTypes, }: {
        name: string;
        supportedContentTypes?: bigint | undefined;
        strict?: boolean | undefined;
        gatewayUrls?: string[] | undefined;
    }) => Promise<import("../public.js").GetAbiRecordReturnType>;
    getAddressRecord: ({ name, coin, bypassFormat, gatewayUrls, strict, }: {
        name: string;
        coin?: string | number | undefined;
        bypassFormat?: boolean | undefined;
        strict?: boolean | undefined;
        gatewayUrls?: string[] | undefined;
    }) => Promise<import("../public.js").GetAddressRecordReturnType>;
    getAvailable: ({ name, }: import("../public.js").GetAvailableParameters) => Promise<boolean>;
    getContentHashRecord: ({ name, gatewayUrls, strict, }: {
        name: string;
        strict?: boolean | undefined;
        gatewayUrls?: string[] | undefined;
    }) => Promise<import("../public.js").GetContentHashRecordReturnType>;
    getExpiry: ({ name, contract, }: {
        name: string;
        contract?: ("registrar" | "nameWrapper") | undefined;
    }) => Promise<import("../public.js").GetExpiryReturnType>;
    getName: ({ address, allowMismatch, gatewayUrls, strict, }: import("../public.js").GetNameParameters) => Promise<import("../public.js").GetNameReturnType>;
    getOwner: ({ name, contract, }: import("../public.js").GetOwnerParameters) => Promise<import("../public.js").GetOwnerReturnType>;
    getPrice: ({ nameOrNames, duration, }: import("../public.js").GetPriceParameters) => Promise<import("../public.js").GetPriceReturnType>;
    getRecords: <const TTexts extends readonly string[] = readonly string[], const TCoins extends readonly (string | number)[] = readonly (string | number)[], const TContentHash extends boolean = true, const TAbi extends boolean = true>({ name, texts, coins, contentHash, abi, resolver, gatewayUrls, }: import("../public.js").GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>) => Promise<(TContentHash extends true ? {
        contentHash: import("../public.js").InternalGetContentHashReturnType;
    } : {}) & (TAbi extends true ? {
        abi: import("../public.js").InternalGetAbiReturnType;
    } : {}) & (TTexts extends readonly string[] ? {
        texts: import("../types.js").DecodedText[];
    } : {}) & (TCoins extends readonly (string | number)[] ? {
        coins: import("../types.js").DecodedAddr[];
    } : {}) & {
        resolverAddress: `0x${string}`;
    } extends infer T ? { [K in keyof T]: ((TContentHash extends true ? {
        contentHash: import("../public.js").InternalGetContentHashReturnType;
    } : {}) & (TAbi extends true ? {
        abi: import("../public.js").InternalGetAbiReturnType;
    } : {}) & (TTexts extends readonly string[] ? {
        texts: import("../types.js").DecodedText[];
    } : {}) & (TCoins extends readonly (string | number)[] ? {
        coins: import("../types.js").DecodedAddr[];
    } : {}) & {
        resolverAddress: `0x${string}`;
    })[K]; } : never>;
    getResolver: ({ name, }: import("../public.js").GetResolverParameters) => Promise<import("../public.js").GetResolverReturnType>;
    getTextRecord: ({ name, key, gatewayUrls, strict, }: {
        name: string;
        key: string;
        strict?: boolean | undefined;
        gatewayUrls?: string[] | undefined;
    }) => Promise<import("../public.js").GetTextRecordReturnType>;
    getWrapperData: ({ name, }: import("../public.js").GetWrapperDataParameters) => Promise<import("../public.js").GetWrapperDataReturnType>;
    getWrapperName: ({ name, }: import("../functions/public/getWrapperName.js").GetWrapperNameParameters) => Promise<import("../functions/public/getWrapperName.js").GetWrapperNameReturnType>;
    getDecodedName: ({ name, allowIncomplete, }: import("../subgraph.js").GetDecodedNameParameters) => Promise<import("../subgraph.js").GetDecodedNameReturnType>;
    getNameHistory: ({ name, }: import("../subgraph.js").GetNameHistoryParameters) => Promise<import("../subgraph.js").GetNameHistoryReturnType>;
    getNamesForAddress: ({ address, filter, orderBy, orderDirection, pageSize, previousPage, }: import("../subgraph.js").GetNamesForAddressParameters) => Promise<import("../subgraph.js").GetNamesForAddressReturnType>;
    getSubgraphRecords: ({ name, resolverAddress, }: import("../subgraph.js").GetSubgraphRecordsParameters) => Promise<import("../subgraph.js").GetSubgraphRecordsReturnType>;
    getSubgraphRegistrant: ({ name, }: import("../subgraph.js").GetSubgraphRegistrantParameters) => Promise<import("../subgraph.js").GetSubgraphRegistrantReturnType>;
    getSubnames: ({ name, searchString, allowExpired, allowDeleted, orderBy, orderDirection, pageSize, previousPage, }: import("../subgraph.js").GetSubnamesParameters) => Promise<import("../subgraph.js").GetSubnamesReturnType>;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<TTransport, ChainWithEns<TChain>, undefined>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<ChainWithEns<TChain>, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: Client<TTransport, ChainWithEns<TChain>, undefined, PublicRpcSchema, EnsPublicActions & EnsSubgraphActions>) => client) => Client<TTransport, ChainWithEns<TChain>, undefined, PublicRpcSchema, { [K_1 in keyof client]: client[K_1]; } & EnsPublicActions & EnsSubgraphActions>;
};
//# sourceMappingURL=public.d.ts.map