import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, TransactionRequestWithPassthrough } from '../../types.js';
import { type GeneratedFunction } from '../../utils/generateFunction.js';
export type GetResolverParameters = {
    /** Name to get resolver for */
    name: string;
};
export type GetResolverReturnType = Address | null;
declare const encode: (client: ClientWithEns, { name }: GetResolverParameters) => TransactionRequestWithPassthrough;
declare const decode: (_client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough) => Promise<GetResolverReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets the resolver address for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetResolverParameters}
 * @returns Resolver address, or null if none is found. {@link GetResolverReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getResolver } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getResolver(client, { name: 'ens.eth' })
 * // 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41
 */
declare const getResolver: ((client: ClientWithEns, { name }: GetResolverParameters) => Promise<GetResolverReturnType>) & BatchableFunctionObject;
export default getResolver;
//# sourceMappingURL=getResolver.d.ts.map