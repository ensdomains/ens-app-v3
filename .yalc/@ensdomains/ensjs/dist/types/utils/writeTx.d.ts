import type { PopulatedTransaction } from '@ethersproject/contracts';
import type { JsonRpcSigner } from '@ethersproject/providers';
declare type CustomData = Record<string, any>;
declare const _default: (signer: JsonRpcSigner, populate: boolean) => ({ customData, ...tx }: PopulatedTransaction) => {
    to?: string | undefined;
    from?: string | undefined;
    nonce?: number | undefined;
    gasLimit?: import("ethers").BigNumber | undefined;
    gasPrice?: import("ethers").BigNumber | undefined;
    data?: string | undefined;
    value?: import("ethers").BigNumber | undefined;
    chainId?: number | undefined;
    type?: number | undefined;
    accessList?: import("@ethersproject/transactions").AccessList | undefined;
    maxFeePerGas?: import("ethers").BigNumber | undefined;
    maxPriorityFeePerGas?: import("ethers").BigNumber | undefined;
    ccipReadEnabled?: boolean | undefined;
} | Promise<import("@ethersproject/abstract-provider").TransactionResponse | (import("@ethersproject/abstract-provider").TransactionResponse & {
    customData: CustomData;
})>;
export default _default;
