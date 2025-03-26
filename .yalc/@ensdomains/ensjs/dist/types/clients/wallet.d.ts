import { type Account, type Address, type Client, type ClientConfig, type ParseAccount, type Transport, type WalletActions, type WalletRpcSchema } from 'viem';
import type { ChainWithBaseContracts, ChainWithEns, CheckedChainWithEns } from '../contracts/consts.js';
import type { Assign, Prettify } from '../types.js';
import { type EnsWalletActions } from './decorators/wallet.js';
export type EnsWalletClientConfig<TTransport extends Transport, TChain extends ChainWithBaseContracts, TAccountOrAddress extends Account | Address | undefined = Account | Address | undefined> = Assign<Pick<ClientConfig<TTransport, TChain, TAccountOrAddress>, 'account' | 'chain' | 'key' | 'name' | 'pollingInterval' | 'transport'>, {
    chain: TChain;
}>;
export type EnsWalletClient<TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns, TAccount extends Account | undefined = Account | undefined> = Prettify<Client<TTransport, TChain, TAccount, WalletRpcSchema, WalletActions<TChain, TAccount> & EnsWalletActions<TChain, TAccount>>>;
/**
 * Creates an ENS Wallet Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsWalletClientConfig}
 * @returns An ENS Wallet Client. {@link EnsWalletClient}
 *
 * @example
 * import { custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsWalletClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 */
export declare const createEnsWalletClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts, TAccountOrAddress extends `0x${string}` | Account | undefined = undefined>({ account, chain, key, name, transport, pollingInterval, }: EnsWalletClientConfig<TTransport, TChain, TAccountOrAddress>) => {
    account: ParseAccount<TAccountOrAddress>;
    batch?: {
        /**
         * Creates an ENS Wallet Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
         *
         * @param config - {@link EnsWalletClientConfig}
         * @returns An ENS Wallet Client. {@link EnsWalletClient}
         *
         * @example
         * import { custom } from 'viem'
         * import { mainnet } from 'viem/chains'
         * import { createEnsWalletClient } from '@ensdomains/ensjs'
         *
         * const client = createEnsWalletClient({
         *   chain: mainnet,
         *   transport: custom(window.ethereum),
         * })
         */
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: CheckedChainWithEns<TChain>;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<WalletRpcSchema>;
    transport: ReturnType<TTransport>["config"] & ReturnType<TTransport>["value"];
    type: string;
    uid: string;
    addChain: (args: import("viem").AddChainParameters) => Promise<void>;
    deployContract: <const abi extends import("viem").Abi | readonly unknown[], chainOverride extends import("viem").Chain | undefined>(args: import("viem").DeployContractParameters<abi, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, chainOverride>) => Promise<`0x${string}`>;
    getAddresses: () => Promise<import("viem").GetAddressesReturnType>;
    getChainId: () => Promise<number>;
    getPermissions: () => Promise<import("viem").GetPermissionsReturnType>;
    prepareTransactionRequest: <const request extends import("viem").PrepareTransactionRequestRequest<CheckedChainWithEns<TChain>, chainOverride_1>, chainOverride_1 extends import("viem").Chain | undefined = undefined, accountOverride extends `0x${string}` | Account | undefined = undefined>(args: import("viem").PrepareTransactionRequestParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, chainOverride_1, accountOverride, request>) => Promise<import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1> extends infer T_14 ? T_14 extends import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1> ? T_14 extends import("viem").Chain ? {
        chain: T_14;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<ParseAccount<TAccountOrAddress>, accountOverride> extends infer T_15 ? T_15 extends import("viem").DeriveAccount<ParseAccount<TAccountOrAddress>, accountOverride> ? T_15 extends Account ? {
        account: T_15;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_16 ? T_16 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_16 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_17 ? T_17 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_17 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_18 ? T_18 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_18 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_19 ? T_19 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_19 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_20 ? T_20 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_20 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_21 ? T_21 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_21 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_22 ? T_22 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_22 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_23 ? T_23 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_23 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_24 ? T_24 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_24 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_25 ? T_25 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_25 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") extends infer T_26 ? T_26 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") ? T_26 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_26 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">) extends infer T ? { [K in keyof T]: (import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1> extends infer T_1 ? T_1 extends import("viem").DeriveChain<CheckedChainWithEns<TChain>, chainOverride_1> ? T_1 extends import("viem").Chain ? {
        chain: T_1;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<ParseAccount<TAccountOrAddress>, accountOverride> extends infer T_2 ? T_2 extends import("viem").DeriveAccount<ParseAccount<TAccountOrAddress>, accountOverride> ? T_2 extends Account ? {
        account: T_2;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_3 ? T_3 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_3 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_4 ? T_4 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_4 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_5 ? T_5 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_5 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_6 ? T_6 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_6 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_7 ? T_7 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_7 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_8 ? T_8 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_8 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_9 ? T_9 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_9 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_10 ? T_10 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_10 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_11 ? T_11 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_11 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_12 ? T_12 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | (import("viem").ValueOf<Required<{ [K_1 in keyof request]: K_1 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "r" | "s" | "v" | "yParity" | "chainId" ? K_1 : undefined; }>> extends string ? import("viem").TransactionSerializableLegacy : never) | (import("viem").ValueOf<Required<{ [K_2 in keyof request]: K_2 extends keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "legacy"> ? K_2 : undefined; }>> extends string ? import("viem").TransactionRequestLegacy : never) ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | (import("viem").ValueOf<Required<{ [K_3 in keyof request]: K_3 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_3 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP1559 : never) | (import("viem").ValueOf<Required<{ [K_4 in keyof request]: K_4 extends "accessList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip1559"> ? K_4 : undefined; }>> extends string ? import("viem").TransactionRequestEIP1559 : never) ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        authorizationList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | (import("viem").ValueOf<Required<{ [K_5 in keyof request]: K_5 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_5 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP2930 : never) | (import("viem").ValueOf<Required<{ [K_6 in keyof request]: K_6 extends "accessList" | keyof import("viem").FeeValuesLegacy<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip2930"> ? K_6 : undefined; }>> extends string ? import("viem").TransactionRequestEIP2930 : never) ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | (import("viem").ValueOf<Required<{ [K_7 in keyof request]: K_7 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" | "r" | "s" | "v" | "yParity" | "chainId" ? K_7 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP4844 : never) | (import("viem").ValueOf<Required<{ [K_8 in keyof request]: K_8 extends "to" | "data" | "from" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "blobs" | "blobVersionedHashes" | "kzg" | "sidecars" ? K_8 : undefined; }>> extends string ? import("viem").TransactionRequestEIP4844 : never) ? "eip4844" : never) | (request extends ({
        accessList?: undefined;
        authorizationList?: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesEIP1559> & {
        authorizationList: import("viem/_types/experimental/eip7702/types/authorization.js").SignedAuthorizationList;
    }) | (import("viem").ValueOf<Required<{ [K_9 in keyof request]: K_9 extends "to" | "data" | "gas" | "nonce" | "type" | "value" | "maxFeePerBlobGas" | "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" | "accessList" | "authorizationList" | "r" | "s" | "v" | "yParity" | "chainId" ? K_9 : undefined; }>> extends string ? import("viem").TransactionSerializableEIP7702 : never) | (import("viem").ValueOf<Required<{ [K_10 in keyof request]: K_10 extends "accessList" | "authorizationList" | keyof import("viem").FeeValuesEIP1559<bigint> | keyof import("viem").TransactionRequestBase<bigint, number, "eip7702"> ? K_10 : undefined; }>> extends string ? import("viem").TransactionRequestEIP7702 : never) ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_12 extends "eip7702" ? import("viem").TransactionRequestEIP7702 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") extends infer T_13 ? T_13 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "gas" | "nonce" | "type" | "blobVersionedHashes" | "fees" | "chainId") ? T_13 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_13 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">))[K]; } : never>;
    requestAddresses: () => Promise<import("viem").RequestAddressesReturnType>;
    requestPermissions: (args: {
        [x: string]: Record<string, any>;
        eth_accounts: Record<string, any>;
    }) => Promise<import("viem").RequestPermissionsReturnType>;
    sendRawTransaction: (args: import("viem").SendRawTransactionParameters) => Promise<`0x${string}`>;
    sendTransaction: <const request_1 extends import("viem").SendTransactionRequest<CheckedChainWithEns<TChain>, chainOverride_2>, chainOverride_2 extends import("viem").Chain | undefined = undefined>(args: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, chainOverride_2, request_1>) => Promise<`0x${string}`>;
    signMessage: (args: import("viem").SignMessageParameters<ParseAccount<TAccountOrAddress>>) => Promise<`0x${string}`>;
    signTransaction: <chainOverride_3 extends import("viem").Chain | undefined>(args: import("viem").SignTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, chainOverride_3>) => Promise<`0x02${string}` | `0x01${string}` | `0x03${string}` | `0x04${string}` | import("viem").TransactionSerializedLegacy>;
    signTypedData: <const typedData extends {
        [x: string]: readonly import("viem").TypedDataParameter[];
        [x: `string[${string}]`]: undefined;
        [x: `function[${string}]`]: undefined;
        [x: `address[${string}]`]: undefined;
        [x: `bytes[${string}]`]: undefined;
        [x: `uint32[${string}]`]: undefined;
        [x: `bool[${string}]`]: undefined;
        [x: `bytes1[${string}]`]: undefined;
        [x: `bytes2[${string}]`]: undefined;
        [x: `bytes4[${string}]`]: undefined;
        [x: `bytes8[${string}]`]: undefined;
        [x: `bytes5[${string}]`]: undefined;
        [x: `bytes12[${string}]`]: undefined;
        [x: `bytes22[${string}]`]: undefined;
        [x: `bytes6[${string}]`]: undefined;
        [x: `bytes3[${string}]`]: undefined;
        [x: `bytes7[${string}]`]: undefined;
        [x: `bytes9[${string}]`]: undefined;
        [x: `bytes10[${string}]`]: undefined;
        [x: `bytes11[${string}]`]: undefined;
        [x: `bytes13[${string}]`]: undefined;
        [x: `bytes14[${string}]`]: undefined;
        [x: `bytes15[${string}]`]: undefined;
        [x: `bytes16[${string}]`]: undefined;
        [x: `bytes17[${string}]`]: undefined;
        [x: `bytes18[${string}]`]: undefined;
        [x: `bytes19[${string}]`]: undefined;
        [x: `bytes20[${string}]`]: undefined;
        [x: `bytes21[${string}]`]: undefined;
        [x: `bytes23[${string}]`]: undefined;
        [x: `bytes24[${string}]`]: undefined;
        [x: `bytes25[${string}]`]: undefined;
        [x: `bytes26[${string}]`]: undefined;
        [x: `bytes27[${string}]`]: undefined;
        [x: `bytes28[${string}]`]: undefined;
        [x: `bytes29[${string}]`]: undefined;
        [x: `bytes30[${string}]`]: undefined;
        [x: `bytes31[${string}]`]: undefined;
        [x: `bytes32[${string}]`]: undefined;
        [x: `int[${string}]`]: undefined;
        [x: `int8[${string}]`]: undefined;
        [x: `int40[${string}]`]: undefined;
        [x: `int16[${string}]`]: undefined;
        [x: `int24[${string}]`]: undefined;
        [x: `int32[${string}]`]: undefined;
        [x: `int48[${string}]`]: undefined;
        [x: `int56[${string}]`]: undefined;
        [x: `int64[${string}]`]: undefined;
        [x: `int72[${string}]`]: undefined;
        [x: `int80[${string}]`]: undefined;
        [x: `int88[${string}]`]: undefined;
        [x: `int96[${string}]`]: undefined;
        [x: `int104[${string}]`]: undefined;
        [x: `int112[${string}]`]: undefined;
        [x: `int120[${string}]`]: undefined;
        [x: `int128[${string}]`]: undefined;
        [x: `int136[${string}]`]: undefined;
        [x: `int144[${string}]`]: undefined;
        [x: `int152[${string}]`]: undefined;
        [x: `int160[${string}]`]: undefined;
        [x: `int168[${string}]`]: undefined;
        [x: `int176[${string}]`]: undefined;
        [x: `int184[${string}]`]: undefined;
        [x: `int192[${string}]`]: undefined;
        [x: `int200[${string}]`]: undefined;
        [x: `int208[${string}]`]: undefined;
        [x: `int216[${string}]`]: undefined;
        [x: `int224[${string}]`]: undefined;
        [x: `int232[${string}]`]: undefined;
        [x: `int240[${string}]`]: undefined;
        [x: `int248[${string}]`]: undefined;
        [x: `int256[${string}]`]: undefined;
        [x: `uint[${string}]`]: undefined;
        [x: `uint8[${string}]`]: undefined;
        [x: `uint40[${string}]`]: undefined;
        [x: `uint16[${string}]`]: undefined;
        [x: `uint24[${string}]`]: undefined;
        [x: `uint48[${string}]`]: undefined;
        [x: `uint56[${string}]`]: undefined;
        [x: `uint64[${string}]`]: undefined;
        [x: `uint72[${string}]`]: undefined;
        [x: `uint80[${string}]`]: undefined;
        [x: `uint88[${string}]`]: undefined;
        [x: `uint96[${string}]`]: undefined;
        [x: `uint104[${string}]`]: undefined;
        [x: `uint112[${string}]`]: undefined;
        [x: `uint120[${string}]`]: undefined;
        [x: `uint128[${string}]`]: undefined;
        [x: `uint136[${string}]`]: undefined;
        [x: `uint144[${string}]`]: undefined;
        [x: `uint152[${string}]`]: undefined;
        [x: `uint160[${string}]`]: undefined;
        [x: `uint168[${string}]`]: undefined;
        [x: `uint176[${string}]`]: undefined;
        [x: `uint184[${string}]`]: undefined;
        [x: `uint192[${string}]`]: undefined;
        [x: `uint200[${string}]`]: undefined;
        [x: `uint208[${string}]`]: undefined;
        [x: `uint216[${string}]`]: undefined;
        [x: `uint224[${string}]`]: undefined;
        [x: `uint232[${string}]`]: undefined;
        [x: `uint240[${string}]`]: undefined;
        [x: `uint248[${string}]`]: undefined;
        [x: `uint256[${string}]`]: undefined;
        string?: undefined;
        address?: undefined;
        bytes?: undefined;
        uint32?: undefined;
        bool?: undefined;
        bytes1?: undefined;
        bytes2?: undefined;
        bytes4?: undefined;
        bytes8?: undefined;
        bytes5?: undefined;
        bytes12?: undefined;
        bytes22?: undefined;
        bytes6?: undefined;
        bytes3?: undefined;
        bytes7?: undefined;
        bytes9?: undefined;
        bytes10?: undefined;
        bytes11?: undefined;
        bytes13?: undefined;
        bytes14?: undefined;
        bytes15?: undefined;
        bytes16?: undefined;
        bytes17?: undefined;
        bytes18?: undefined;
        bytes19?: undefined;
        bytes20?: undefined;
        bytes21?: undefined;
        bytes23?: undefined;
        bytes24?: undefined;
        bytes25?: undefined;
        bytes26?: undefined;
        bytes27?: undefined;
        bytes28?: undefined;
        bytes29?: undefined;
        bytes30?: undefined;
        bytes31?: undefined;
        bytes32?: undefined;
        int8?: undefined;
        int40?: undefined;
        int16?: undefined;
        int24?: undefined;
        int32?: undefined;
        int48?: undefined;
        int56?: undefined;
        int64?: undefined;
        int72?: undefined;
        int80?: undefined;
        int88?: undefined;
        int96?: undefined;
        int104?: undefined;
        int112?: undefined;
        int120?: undefined;
        int128?: undefined;
        int136?: undefined;
        int144?: undefined;
        int152?: undefined;
        int160?: undefined;
        int168?: undefined;
        int176?: undefined;
        int184?: undefined;
        int192?: undefined;
        int200?: undefined;
        int208?: undefined;
        int216?: undefined;
        int224?: undefined;
        int232?: undefined;
        int240?: undefined;
        int248?: undefined;
        int256?: undefined;
        uint8?: undefined;
        uint40?: undefined;
        uint16?: undefined;
        uint24?: undefined;
        uint48?: undefined;
        uint56?: undefined;
        uint64?: undefined;
        uint72?: undefined;
        uint80?: undefined;
        uint88?: undefined;
        uint96?: undefined;
        uint104?: undefined;
        uint112?: undefined;
        uint120?: undefined;
        uint128?: undefined;
        uint136?: undefined;
        uint144?: undefined;
        uint152?: undefined;
        uint160?: undefined;
        uint168?: undefined;
        uint176?: undefined;
        uint184?: undefined;
        uint192?: undefined;
        uint200?: undefined;
        uint208?: undefined;
        uint216?: undefined;
        uint224?: undefined;
        uint232?: undefined;
        uint240?: undefined;
        uint248?: undefined;
        uint256?: undefined;
    } | {
        [key: string]: unknown;
    }, primaryType extends string>(args: import("viem").SignTypedDataParameters<typedData, primaryType, ParseAccount<TAccountOrAddress>>) => Promise<`0x${string}`>;
    switchChain: (args: import("viem").SwitchChainParameters) => Promise<void>;
    watchAsset: (args: import("viem").WatchAssetParams) => Promise<boolean>;
    writeContract: <const abi_1 extends import("viem").Abi | readonly unknown[], functionName extends import("viem").ContractFunctionName<abi_1, "payable" | "nonpayable">, args extends import("viem").ContractFunctionArgs<abi_1, "payable" | "nonpayable", functionName>, chainOverride_4 extends import("viem").Chain | undefined = undefined>(args: import("viem").WriteContractParameters<abi_1, functionName, args, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, chainOverride_4>) => Promise<`0x${string}`>;
    clearRecords: ({ name, resolverAddress, ...txArgs }: {
        name: string;
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    commitName: ({ name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, ...txArgs }: {
        name: string;
        owner: `0x${string}`;
        duration: number;
        secret: `0x${string}`;
        resolverAddress?: `0x${string}` | undefined;
        records?: {
            clearRecords?: boolean | undefined;
            contentHash?: string | null | undefined;
            texts?: Omit<import("../utils/index.js").EncodeSetTextParameters, "namehash">[] | undefined;
            coins?: Omit<import("../utils/index.js").EncodeSetAddrParameters, "namehash">[] | undefined;
            abi?: import("../utils/index.js").EncodedAbi | import("../utils/index.js").EncodedAbi[] | undefined;
        } | undefined;
        reverseRecord?: boolean | undefined;
        fuses?: import("../utils/fuses.js").EncodeChildFusesInputObject | undefined;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    createSubname: ({ name, contract, owner, resolverAddress, expiry, fuses, ...txArgs }: import("../wallet.js").CreateSubnameParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>) => Promise<`0x${string}`>;
    deleteSubname: ({ name, contract, asOwner, ...txArgs }: {
        name: string;
        contract: "nameWrapper" | "registry";
        asOwner?: boolean | undefined;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    registerName: ({ name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, value, ...txArgs }: {
        name: string;
        owner: `0x${string}`;
        duration: number;
        secret: `0x${string}`;
        resolverAddress?: `0x${string}` | undefined;
        records?: {
            clearRecords?: boolean | undefined;
            contentHash?: string | null | undefined;
            texts?: Omit<import("../utils/index.js").EncodeSetTextParameters, "namehash">[] | undefined;
            coins?: Omit<import("../utils/index.js").EncodeSetAddrParameters, "namehash">[] | undefined;
            abi?: import("../utils/index.js").EncodedAbi | import("../utils/index.js").EncodedAbi[] | undefined;
        } | undefined;
        reverseRecord?: boolean | undefined;
        fuses?: import("../utils/fuses.js").EncodeChildFusesInputObject | undefined;
        value: bigint;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    renewNames: ({ nameOrNames, duration, value, ...txArgs }: {
        nameOrNames: string | string[];
        duration: number | bigint;
        value: bigint;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setAbiRecord: ({ name, encodedAbi, resolverAddress, ...txArgs }: {
        name: string;
        encodedAbi: import("../utils/index.js").EncodedAbi;
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setAddressRecord: ({ name, coin, value, resolverAddress, ...txArgs }: {
        name: string;
        coin: string | number;
        value: string | null;
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setChildFuses: ({ name, fuses, expiry, ...txArgs }: {
        name: string;
        fuses: import("../utils/fuses.js").EncodeFusesInputObject;
        expiry?: number | bigint | undefined;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setContentHashRecord: ({ name, contentHash, resolverAddress, ...txArgs }: {
        name: string;
        contentHash: string | null;
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setFuses: ({ name, fuses, ...txArgs }: {
        name: string;
        fuses: import("../utils/fuses.js").EncodeChildFusesInputObject;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setPrimaryName: ({ name, address, resolverAddress, ...txArgs }: import("../wallet.js").SetPrimaryNameParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>) => Promise<`0x${string}`>;
    setRecords: ({ name, resolverAddress, clearRecords, contentHash, texts, coins, abi, ...txArgs }: {
        name: string;
        resolverAddress: `0x${string}`;
        clearRecords?: boolean | undefined;
        contentHash?: string | null | undefined;
        texts?: Omit<import("../utils/index.js").EncodeSetTextParameters, "namehash">[] | undefined;
        coins?: Omit<import("../utils/index.js").EncodeSetAddrParameters, "namehash">[] | undefined;
        abi?: import("../utils/index.js").EncodedAbi | import("../utils/index.js").EncodedAbi[] | undefined;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setResolver: ({ name, contract, resolverAddress, ...txArgs }: {
        name: string;
        contract: "nameWrapper" | "registry";
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    setTextRecord: ({ name, key, value, resolverAddress, ...txArgs }: {
        name: string;
        key: string;
        value: string | null;
        resolverAddress: `0x${string}`;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
    transferName: ({ name, newOwnerAddress, contract, reclaim, asParent, ...txArgs }: import("../wallet.js").TransferNameParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>) => Promise<`0x${string}`>;
    unwrapName: <TName extends string>({ name, newOwnerAddress, newRegistrantAddress, ...txArgs }: import("../wallet.js").UnwrapNameParameters<TName, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>) => Promise<`0x${string}`>;
    wrapName: <TName_1 extends string>({ name, newOwnerAddress, fuses, resolverAddress, ...txArgs }: {
        name: TName_1;
        newOwnerAddress: `0x${string}`;
        fuses?: (import("../types.js").GetNameType<TName_1> extends infer T_27 ? T_27 extends import("../types.js").GetNameType<TName_1> ? T_27 extends "eth-2ld" ? import("../utils/fuses.js").EncodeChildFusesInputObject : never : never : never) | undefined;
        resolverAddress?: `0x${string}` | undefined;
        gas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gas"] | undefined;
        nonce?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["nonce"] | undefined;
        gasPrice?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["gasPrice"] | undefined;
        maxFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxFeePerGas"] | undefined;
        maxPriorityFeePerGas?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["maxPriorityFeePerGas"] | undefined;
        account?: import("viem").SendTransactionParameters<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, CheckedChainWithEns<TChain>>["account"] | undefined;
    }) => Promise<`0x${string}`>;
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
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<TTransport, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<WalletActions<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>, "sendTransaction" | "writeContract">>>(fn: (client: Client<TTransport, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, WalletRpcSchema, WalletActions<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>> & EnsWalletActions<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>>) => client) => Client<TTransport, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>, WalletRpcSchema, { [K_11 in keyof client]: client[K_11]; } & WalletActions<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>> & EnsWalletActions<CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>>;
};
//# sourceMappingURL=wallet.d.ts.map