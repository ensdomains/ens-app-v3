import type { JsonRpcSigner } from '@ethersproject/providers';
import type { PopulatedTransaction } from 'ethers';
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
    accessList?: import("ethers/lib/utils").AccessList | undefined;
    maxFeePerGas?: import("ethers").BigNumber | undefined;
    maxPriorityFeePerGas?: import("ethers").BigNumber | undefined;
    ccipReadEnabled?: boolean | undefined;
} | Promise<import("@ethersproject/providers").TransactionResponse | (import("@ethersproject/providers").TransactionResponse & {
    customData: CustomData;
})>;
export default _default;
