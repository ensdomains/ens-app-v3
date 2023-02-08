import { ENSArgs } from '..';
import { CommitmentParams } from '../utils/registerHelpers';
declare type Params = Omit<CommitmentParams, 'resolver' | 'name'> & {
    resolverAddress?: string;
};
export default function ({ contracts }: ENSArgs<'contracts'>, name: string, { resolverAddress, ...params }: Params): Promise<{
    customData: {
        secret: string;
        commitment: string;
    };
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
}>;
export {};
