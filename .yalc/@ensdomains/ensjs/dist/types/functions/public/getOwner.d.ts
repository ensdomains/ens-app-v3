import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest } from '../../types.js';
import { type OwnerContract } from '../../utils/ownerFromContract.js';
export type GetOwnerParameters<TContract extends OwnerContract | undefined = undefined> = {
    /** Name to get owner for */
    name: string;
    /** Optional specific contract to get ownership value from */
    contract?: TContract;
};
type BaseGetOwnerReturnType = {
    /** Owner of the name */
    owner?: Address | null;
    /** Registrant of the name (registrar owner) */
    registrant?: Address | null;
    /** The contract level that the ownership is on */
    ownershipLevel: 'registry' | 'registrar' | 'nameWrapper';
};
type RegistrarOnlyOwnership = {
    owner?: never;
    registrant: Address;
    ownershipLevel: 'registrar';
};
type WrappedOwnership = {
    owner: Address;
    registrant?: never;
    ownershipLevel: 'nameWrapper';
};
type UnwrappedEth2ldOwnership = {
    registrant: Address | null;
    owner: Address;
    ownershipLevel: 'registrar';
};
type UnwrappedOwnership = {
    owner: Address;
    registrant?: never;
    ownershipLevel: 'registry';
};
export type GetOwnerReturnType<TContract extends OwnerContract | undefined = undefined> = (BaseGetOwnerReturnType & (TContract extends 'registrar' ? RegistrarOnlyOwnership : TContract extends 'nameWrapper' ? WrappedOwnership : TContract extends 'registry' ? UnwrappedOwnership : WrappedOwnership | UnwrappedEth2ldOwnership | UnwrappedOwnership)) | null;
declare const encode: <TContract extends OwnerContract | undefined = undefined>(client: ClientWithEns, { name, contract }: GetOwnerParameters<TContract>) => SimpleTransactionRequest;
declare const decode: <TContract extends OwnerContract | undefined = undefined>(client: ClientWithEns, data: Hex | BaseError, { name, contract }: GetOwnerParameters<TContract>) => Promise<GetOwnerReturnType<TContract>>;
type EncoderFunction = typeof encode;
type DecoderFunction = typeof decode;
type BatchableFunctionObject = {
    encode: EncoderFunction;
    decode: DecoderFunction;
    batch: <TContract extends OwnerContract | undefined = undefined, TParams extends GetOwnerParameters<TContract> = GetOwnerParameters<TContract>>(args: TParams) => {
        args: [TParams];
        encode: EncoderFunction;
        decode: typeof decode<TContract>;
    };
};
/**
 * Gets the owner(s) of a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetOwnerParameters}
 * @returns Owner data object, or `null` if no owners exist. {@link GetOwnerReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getOwner } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getOwner(client, { name: 'ens.eth' })
 * // { owner: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', registrant: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', ownershipLevel: 'registrar }
 */
declare const getOwner: (<TContract extends OwnerContract | undefined = undefined>(client: ClientWithEns, { name, contract }: GetOwnerParameters<TContract>) => Promise<GetOwnerReturnType<TContract>>) & BatchableFunctionObject;
export default getOwner;
//# sourceMappingURL=getOwner.d.ts.map