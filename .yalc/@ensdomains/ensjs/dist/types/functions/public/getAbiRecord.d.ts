import type { BaseError, Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, Prettify, SimpleTransactionRequest } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
import { type InternalGetAbiParameters, type InternalGetAbiReturnType } from './_getAbi.js';
export type GetAbiRecordParameters = Prettify<InternalGetAbiParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[];
}>;
export type GetAbiRecordReturnType = Prettify<InternalGetAbiReturnType>;
declare const encode: (client: ClientWithEns, { name, supportedContentTypes, gatewayUrls, }: Omit<GetAbiRecordParameters, 'strict'>) => SimpleTransactionRequest;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough, { strict, gatewayUrls, }: Pick<GetAbiRecordParameters, 'strict' | 'gatewayUrls'>) => Promise<GetAbiRecordReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the ABI record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAbiRecordParameters}
 * @returns ABI record for the name, or `null` if not found. {@link GetAbiRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAbiRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAbiRecord(client, { name: 'ens.eth' })
 * // TODO: real example
 */
declare const getAbiRecord: ((client: ClientWithEns, { name, strict, gatewayUrls, supportedContentTypes }: GetAbiRecordParameters) => Promise<GetAbiRecordReturnType>) & BatchableFunctionObject;
export default getAbiRecord;
//# sourceMappingURL=getAbiRecord.d.ts.map