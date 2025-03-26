import { BaseError, type Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts.js';
import type { SimpleTransactionRequest, TransactionRequestWithPassthrough } from '../../types.js';
export type MulticallWrapperParameters = {
    transactions: SimpleTransactionRequest[];
    requireSuccess?: boolean;
};
export type MulticallWrapperReturnType = {
    success: boolean;
    returnData: Hex;
}[];
declare const multicallWrapper: import("../../utils/generateFunction.js").GeneratedFunction<(client: ClientWithEns, { transactions, requireSuccess }: MulticallWrapperParameters) => SimpleTransactionRequest, (client: ClientWithEns, data: Hex | BaseError, transactions: TransactionRequestWithPassthrough[]) => Promise<MulticallWrapperReturnType>>;
export default multicallWrapper;
//# sourceMappingURL=multicallWrapper.d.ts.map