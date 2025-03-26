import type { BaseError, Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, Prettify, TransactionRequestWithPassthrough } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
import { type InternalGetContentHashParameters, type InternalGetContentHashReturnType } from './_getContentHash.js';
export type GetContentHashRecordParameters = Prettify<InternalGetContentHashParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[];
}>;
export type GetContentHashRecordReturnType = Prettify<InternalGetContentHashReturnType>;
declare const encode: (client: ClientWithEns, { name, gatewayUrls }: Omit<GetContentHashRecordParameters, 'strict'>) => TransactionRequestWithPassthrough;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough, { strict, gatewayUrls, }: Pick<GetContentHashRecordParameters, 'strict' | 'gatewayUrls'>) => Promise<GetContentHashRecordReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the content hash record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetContentHashRecordParameters}
 * @returns Content hash object, or `null` if not found. {@link GetContentHashRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getContentHashRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getContentHashRecord(client, { name: 'ens.eth' })
 * // { protocolType: 'ipfs', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' }
 */
declare const getContentHashRecord: ((client: ClientWithEns, { name, strict, gatewayUrls }: GetContentHashRecordParameters) => Promise<GetContentHashRecordReturnType>) & BatchableFunctionObject;
export default getContentHashRecord;
//# sourceMappingURL=getContentHashRecord.d.ts.map