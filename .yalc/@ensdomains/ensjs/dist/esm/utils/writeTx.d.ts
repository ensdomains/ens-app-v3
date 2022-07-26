import { JsonRpcSigner } from '@ethersproject/providers';
import type { PopulatedTransaction } from 'ethers';
declare const _default: (signer: JsonRpcSigner, populate: boolean) => (tx: PopulatedTransaction) => PopulatedTransaction | Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
export default _default;
