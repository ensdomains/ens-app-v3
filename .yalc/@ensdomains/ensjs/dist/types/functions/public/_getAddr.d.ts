import { type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { DecodedAddr, Prettify, SimpleTransactionRequest } from '../../types.js';
export type InternalGetAddrParameters = {
    /** Name to get the address record for */
    name: string;
    /** Coin to get the address record for, can be either symbol (string) or coinId (number) (default: `60`) */
    coin?: string | number;
    /** Optionally return raw bytes value of address record (default: false) */
    bypassFormat?: boolean;
    /** Whether or not to throw decoding errors */
    strict?: boolean;
};
export type InternalGetAddrReturnType = Prettify<DecodedAddr | null>;
declare const _getAddr: import("../../utils/generateFunction.js").GeneratedFunction<(_client: ClientWithEns, { name, coin, bypassFormat }: Omit<InternalGetAddrParameters, 'strict'>) => SimpleTransactionRequest, (_client: ClientWithEns, data: Hex, { coin, strict }: Pick<InternalGetAddrParameters, 'coin' | 'strict'>) => Promise<InternalGetAddrReturnType>>;
export default _getAddr;
//# sourceMappingURL=_getAddr.d.ts.map