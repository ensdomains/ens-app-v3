import type { BaseError, Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, Prettify, SimpleTransactionRequest } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
import { type InternalGetAddrParameters, type InternalGetAddrReturnType } from './_getAddr.js';
export type GetAddressRecordParameters = Prettify<InternalGetAddrParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[];
}>;
export type GetAddressRecordReturnType = Prettify<InternalGetAddrReturnType>;
declare const encode: (client: ClientWithEns, { name, coin, gatewayUrls, }: Omit<GetAddressRecordParameters, 'strict' | 'bypassFormat'>) => SimpleTransactionRequest;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough, { coin, strict, gatewayUrls, }: Pick<GetAddressRecordParameters, 'coin' | 'strict' | 'gatewayUrls'>) => Promise<GetAddressRecordReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets an address record for a name and specified coin
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAddressRecordParameters}
 * @returns Coin value object, or `null` if not found. {@link GetAddressRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAddressRecord(client, { name: 'ens.eth', coin: 'ETH' })
 * // { id: 60, name: 'ETH , value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
 */
declare const getAddressRecord: ((client: ClientWithEns, { name, coin, bypassFormat, strict, gatewayUrls }: GetAddressRecordParameters) => Promise<GetAddressRecordReturnType>) & BatchableFunctionObject;
export default getAddressRecord;
//# sourceMappingURL=getAddressRecord.d.ts.map