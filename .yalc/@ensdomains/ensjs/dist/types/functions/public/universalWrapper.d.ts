import { BaseError, type Address, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { GenericPassthrough, TransactionRequestWithPassthrough } from '../../types.js';
export type UniversalWrapperParameters = {
    name: string;
    data: Hex;
    strict?: boolean;
    gatewayUrls?: string[];
};
export type UniversalWrapperReturnType = {
    data: Hex;
    resolver: Address;
} | null;
declare const universalWrapper: import("../../utils/generateFunction.js").GeneratedFunction<(client: ClientWithEns, { name, data, gatewayUrls }: Omit<UniversalWrapperParameters, 'strict'>) => TransactionRequestWithPassthrough, (_client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough, { strict, gatewayUrls, }: Pick<UniversalWrapperParameters, 'strict' | 'gatewayUrls'>) => Promise<UniversalWrapperReturnType>>;
export default universalWrapper;
//# sourceMappingURL=universalWrapper.d.ts.map