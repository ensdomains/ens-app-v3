import type { Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { TransactionRequestWithPassthrough } from '../../types.js';
import { type BatchFunctionResult, type GeneratedFunction } from '../../utils/generateFunction.js';
type ExtractResult<TFunction extends BatchFunctionResult> = TFunction extends {
    decode: (...args: any[]) => Promise<infer U>;
} ? U : never;
export type BatchParameters = BatchFunctionResult[];
export type BatchReturnType<TFunctions extends BatchFunctionResult[]> = {
    [TFunctionName in keyof TFunctions]: ExtractResult<TFunctions[TFunctionName]>;
};
declare const encode: (client: ClientWithEns, ...items: BatchFunctionResult[]) => TransactionRequestWithPassthrough;
declare const decode: <I extends BatchFunctionResult[]>(client: ClientWithEns, data: Hex, passthrough: TransactionRequestWithPassthrough[], ...items: I) => Promise<BatchReturnType<I>>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Batches multiple read functions into a single call.
 * @param client - {@link ClientWithEns}
 * @param ...parameters - Array of {@link BatchFunctionResult} objects
 * @returns Array of return values from each function
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { batch, getTextRecord, getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await batch(
 *   client,
 *   getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
 *   getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
 * )
 * // ['ensdomains', { id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7 }]
 */
declare const batch: (<I extends BatchFunctionResult[]>(client: ClientWithEns, ...args: I) => Promise<BatchReturnType<I>>) & BatchableFunctionObject;
export default batch;
//# sourceMappingURL=batch.d.ts.map