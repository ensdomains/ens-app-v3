import { ENSArgs } from '..';
declare type BaseArgs = {
    contract: 'registry' | 'nameWrapper';
    method?: 'setRecord' | 'setSubnodeOwner';
};
declare type NameWrapperArgs = {
    contract: 'nameWrapper';
    method: 'setRecord' | 'setSubnodeOwner';
};
declare type Args = BaseArgs | NameWrapperArgs;
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { contract, ...args }: Args): Promise<import("ethers").PopulatedTransaction>;
export {};
