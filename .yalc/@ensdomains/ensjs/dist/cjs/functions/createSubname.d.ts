import { ethers } from 'ethers';
import { ENSArgs } from '..';
import { FuseOptions } from '../@types/FuseOptions';
declare type BaseArgs = {
    owner: string;
    resolverAddress?: string;
    contract: 'registry' | 'nameWrapper';
};
declare type NameWrapperArgs = {
    contract: 'nameWrapper';
    fuses?: FuseOptions;
} & BaseArgs;
declare type Args = BaseArgs | NameWrapperArgs;
export default function ({ contracts, signer }: ENSArgs<'contracts' | 'signer'>, name: string, { owner, resolverAddress, contract, ...wrapperArgs }: Args): Promise<ethers.ContractTransaction>;
export {};
