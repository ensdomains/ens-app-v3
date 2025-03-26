import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DecodedAddr, DecodedText, Prettify, SimpleTransactionRequest, TransactionRequestWithPassthrough } from '../../types.js';
import { type InternalGetAbiReturnType } from './_getAbi.js';
import { type InternalGetContentHashReturnType } from './_getContentHash.js';
export type GetRecordsParameters<TTexts extends readonly string[] | undefined = readonly string[], TCoins extends readonly (string | number)[] | undefined = readonly (string | number)[], TContentHash extends boolean | undefined = true, TAbi extends boolean | undefined = true> = {
    /** Name to get records for */
    name: string;
    /** Text record key array */
    texts?: TTexts;
    /** Coin record id/symbol array */
    coins?: TCoins;
    /** If true, will fetch content hash */
    contentHash?: TContentHash;
    /** If true, will fetch ABI */
    abi?: TAbi;
    /** Optional specific resolver address, for fallback or for all results */
    resolver?: {
        /** Resolver address */
        address: Address;
        /** If true, will only use resolver if main fetch fails */
        fallbackOnly?: boolean;
    };
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[];
};
type WithContentHashResult = {
    /** Retrieved content hash record for name */
    contentHash: InternalGetContentHashReturnType;
};
type WithAbiResult = {
    /** Retrieved ABI record for name */
    abi: InternalGetAbiReturnType;
};
type WithTextsResult = {
    /** Retrieved text records for name */
    texts: DecodedText[];
};
type WithCoinsResult = {
    /** Retrieved coins for name */
    coins: DecodedAddr[];
};
export type GetRecordsReturnType<TTexts extends readonly string[] | undefined = readonly string[], TCoins extends readonly (string | number)[] | undefined = readonly (string | number)[], TContentHash extends boolean | undefined = true, TAbi extends boolean | undefined = true> = Prettify<(TContentHash extends true ? WithContentHashResult : {}) & (TAbi extends true ? WithAbiResult : {}) & (TTexts extends readonly string[] ? WithTextsResult : {}) & (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
    /** Resolver address used for fetch */
    resolverAddress: Address;
}>;
type CallObj = {
    key: string;
    call: SimpleTransactionRequest;
    type: 'text';
} | {
    key: string | number;
    call: SimpleTransactionRequest;
    type: 'coin';
} | {
    key: 'contentHash';
    call: SimpleTransactionRequest;
    type: 'contentHash';
} | {
    key: 'abi';
    call: SimpleTransactionRequest;
    type: 'abi';
};
type EncodeReturnType = Required<TransactionRequestWithPassthrough<{
    calls: (CallObj | null)[];
    address?: Address;
    args?: any;
}>>;
declare const encode: (client: ClientWithEns, { name, resolver, texts, coins, contentHash, abi, gatewayUrls, }: GetRecordsParameters) => EncodeReturnType;
declare const decode: <const TTexts extends readonly string[] | undefined = readonly string[], const TCoins extends readonly (string | number)[] | undefined = readonly (string | number)[], const TContentHash extends boolean | undefined = undefined, const TAbi extends boolean | undefined = undefined>(client: ClientWithEns, data: Hex | BaseError, passthrough: EncodeReturnType['passthrough'], { resolver, texts, coins, contentHash, abi, gatewayUrls, }: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>) => Promise<(TContentHash extends true ? WithContentHashResult : {}) & (TAbi extends true ? WithAbiResult : {}) & (TTexts extends readonly string[] ? WithTextsResult : {}) & (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
    /** Resolver address used for fetch */
    resolverAddress: Address;
} extends infer T ? { [K in keyof T]: ((TContentHash extends true ? WithContentHashResult : {}) & (TAbi extends true ? WithAbiResult : {}) & (TTexts extends readonly string[] ? WithTextsResult : {}) & (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
    /** Resolver address used for fetch */
    resolverAddress: Address;
})[K]; } : never>;
type EncoderFunction = typeof encode;
type DecoderFunction = typeof decode<any>;
type BatchableFunctionObject = {
    encode: EncoderFunction;
    decode: DecoderFunction;
    batch: <const TTexts extends readonly string[] | undefined = undefined, const TCoins extends readonly (string | number)[] | undefined = undefined, const TContentHash extends boolean | undefined = undefined, const TAbi extends boolean | undefined = undefined>(args: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>) => {
        args: [GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>];
        encode: EncoderFunction;
        decode: typeof decode<TTexts, TCoins, TContentHash, TAbi>;
    };
};
/**
 * Gets arbitrary records for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetRecordsParameters}
 * @returns Records data object. {@link GetRecordsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getRecords } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getRecords(client, {
 *   name: 'ens.eth',
 *   texts: ['com.twitter', 'com.github'],
 *   coins: ['ETH'],
 *   contentHash: true,
 * })
 * // { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
 */
declare const getRecords: (<const TTexts extends readonly string[] | undefined = undefined, const TCoins extends readonly (string | number)[] | undefined = undefined, const TContentHash extends boolean | undefined = undefined, const TAbi extends boolean | undefined = undefined>(client: ClientWithEns, { name, texts, coins, contentHash, abi, resolver, gatewayUrls, }: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>) => Promise<(TContentHash extends true ? WithContentHashResult : {}) & (TAbi extends true ? WithAbiResult : {}) & (TTexts extends readonly string[] ? WithTextsResult : {}) & (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
    /** Resolver address used for fetch */
    resolverAddress: Address;
} extends infer T ? { [K in keyof T]: ((TContentHash extends true ? WithContentHashResult : {}) & (TAbi extends true ? WithAbiResult : {}) & (TTexts extends readonly string[] ? WithTextsResult : {}) & (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
    /** Resolver address used for fetch */
    resolverAddress: Address;
})[K]; } : never>) & BatchableFunctionObject;
export default getRecords;
//# sourceMappingURL=getRecords.d.ts.map