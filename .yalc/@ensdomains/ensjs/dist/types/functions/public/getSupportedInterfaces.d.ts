import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest, TransactionRequestWithPassthrough } from '../../types.js';
export type GetSupportedInterfacesParameters<TInterfaces extends readonly Hex[]> = {
    address: Address;
    interfaces: TInterfaces;
};
export type GetSupportedInterfacesReturnType<TInterfaces extends readonly Hex[]> = {
    -readonly [K in keyof TInterfaces]: boolean;
};
declare const encode: <TInterfaces extends `0x${string}`[]>(client: ClientWithEns, { address, interfaces }: GetSupportedInterfacesParameters<TInterfaces>) => TransactionRequestWithPassthrough;
declare const decode: <const TInterfaces extends readonly `0x${string}`[]>(client: ClientWithEns, data: Hex | BaseError, passthrough: SimpleTransactionRequest[]) => Promise<GetSupportedInterfacesReturnType<TInterfaces>>;
type EncoderFunction = typeof encode;
type DecoderFunction = typeof decode;
type BatchableFunctionObject = {
    encode: EncoderFunction;
    decode: DecoderFunction;
    batch: <const TInterfaces extends readonly Hex[], TParams extends GetSupportedInterfacesParameters<TInterfaces>>(args: TParams) => {
        args: [TParams];
        encode: EncoderFunction;
        decode: typeof decode<TInterfaces>;
    };
};
/**
 * Gets the supported interfaces for any contract address.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSupportedInterfacesParameters}
 * @returns Array of booleans matching the input array {@link GetSupportedInterfacesReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSupportedInterfaces } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSupportedInterfaces(client, {
 *   address: '0x58774Bb8acD458A640aF0B88238369A167546ef2',
 *   interfaces: ['0x2f435428', '0x23b872dd'],
 * })
 * // [true, false]
 */
declare const getSupportedInterfaces: (<const TInterfaces extends readonly `0x${string}`[]>(client: ClientWithEns, { address, interfaces }: GetSupportedInterfacesParameters<TInterfaces>) => Promise<GetSupportedInterfacesReturnType<TInterfaces>>) & BatchableFunctionObject;
export default getSupportedInterfaces;
//# sourceMappingURL=getSupportedInterfaces.d.ts.map