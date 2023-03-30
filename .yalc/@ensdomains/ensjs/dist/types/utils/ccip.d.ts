import type { BaseProvider, TransactionRequest } from '@ethersproject/providers';
declare const ccipLookup: (provider: BaseProvider, transaction: TransactionRequest, result: string) => Promise<string | undefined>;
export default ccipLookup;
